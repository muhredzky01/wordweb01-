import re, json, subprocess, concurrent.futures, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ENTRY_RE = re.compile(r'<div class="flip-entry" id="entry-([^"]+)".*?aria-label="([^"]*)".*?<div class="flip-entry-title">(.*?)</div>', re.S)

def fetch(fid):
    out = f'/tmp/gd_{fid}.html'
    if not os.path.exists(out) or os.path.getsize(out) < 500:
        subprocess.run(['curl','-sL','--max-time','90',f'https://drive.google.com/embeddedfolderview?id={fid}#list','-o',out], check=True)
    return open(out, encoding='utf-8', errors='ignore').read()

def parse(h):
    items = []
    for m in ENTRY_RE.finditer(h):
        title = re.sub('<[^>]+>', '', m.group(3))
        title = title.replace('&#39;', "'").replace('&amp;', '&').replace('&quot;', '"').replace('&lt;','<').replace('&gt;','>')
        items.append({'id': m.group(1), 'kind': 'folder' if m.group(2)=='Folder' else 'file', 'title': title.strip()})
    return items

def crawl(fid, name, depth=0, maxdepth=3):
    try:
        items = parse(fetch(fid))
    except Exception as e:
        return {'id': fid, 'name': name, 'children': [], 'files': [], 'error': str(e)}
    node = {'id': fid, 'name': name, 'children': [], 'files': []}
    for it in items:
        if it['kind'] == 'folder':
            node['children'].append({'id': it['id'], 'name': it['title'], 'depth': depth+1})
        else:
            node['files'].append({'id': it['id'], 'name': it['title']})
    if depth < maxdepth:
        for ch in node['children']:
            sub = crawl(ch['id'], ch['name'], depth+1, maxdepth)
            ch.update(sub)
    return node

roots = [
  ('1FjqTXSvZEHCd15TUhl0qk_zo0hjh_Xq1', 'Kumpulan Buku'),
  ('1Y4nlYY5Hpy_EyzTLlvHpntygblCIwi_g', 'Maktabah Kitab'),
]
out = []
for fid, name in roots:
    print('ROOT', name, flush=True)
    out.append(crawl(fid, name, 0, 2))

json.dump(out, open(os.path.join(ROOT,'scripts','drive_tree.json'),'w',encoding='utf-8'), ensure_ascii=False, indent=1)

def count(n):
    return len(n['files']) + sum(count(c) for c in n.get('children',[]) if 'files' in c)
print('files total', sum(count(x) for x in out))
