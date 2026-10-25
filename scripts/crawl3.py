import re, json, subprocess, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HREF_RE = re.compile(r'<a href="https://drive\.google\.com/(file|drive/folders)/d?/?([^/?"]+)')
TITLE_RE = re.compile(r'<div class="flip-entry-title">(.*?)</div>', re.S)
THUMB_RE = re.compile(r'<div class="flip-entry-thumb"><img src="([^"]+)"')
MOD_RE = re.compile(r'<div class="flip-entry-last-modified"><div>(.*?)</div>')

def unesc(s):
    return (s.replace('&amp;','&').replace('&#39;',"'").replace('&quot;','"')
             .replace('&lt;','<').replace('&gt;','>').replace('&nbsp;',' '))

def fetch(fid):
    out=f'/tmp/gd3_{fid}.html'
    if not os.path.exists(out) or os.path.getsize(out)<300:
        subprocess.run(['curl','-sL','--max-time','60',f'https://drive.google.com/embeddedfolderview?id={fid}#list','-o',out],check=True)
    return open(out,encoding='utf-8',errors='ignore').read()

def parse(h):
    items=[]
    for chunk in h.split('<div class="flip-entry"')[1:]:
        idm=re.search(r'id="entry-([^"]+)"',chunk)
        tm=TITLE_RE.search(chunk)
        if not idm or not tm: continue
        href=HREF_RE.search(chunk)
        is_folder='drive/folders' in chunk[:1200]
        th=THUMB_RE.search(chunk)
        mod=MOD_RE.search(chunk)
        items.append({'id':idm.group(1),'kind':'folder' if is_folder else 'file',
                      'title':unesc(re.sub('<[^>]+>','',tm.group(1))).strip(),
                      'thumb':unesc(th.group(1)) if th else None,
                      'modified':mod.group(1) if mod else None})
    return items

def crawl(fid,name,depth,maxdepth):
    try: items=parse(fetch(fid))
    except Exception as e: return {'id':fid,'name':name,'children':[],'files':[],'error':str(e)}
    node={'id':fid,'name':name,'children':[],'files':[]}
    for it in items:
        if it['kind']=='folder': node['children'].append({'id':it['id'],'name':it['title'],'modified':it['modified']})
        else: node['files'].append({'id':it['id'],'name':it['title'],'thumb':it['thumb'],'modified':it['modified']})
    if depth<maxdepth:
        for ch in node['children']:
            ch.update(crawl(ch['id'],ch['name'],depth+1,maxdepth))
    return node

roots=[('1Y4nlYY5Hpy_EyzTLlvHpntygblCIwi_g','Maktabah Kitab',0,4),
       ('1AbZ04AkNNlT6Wc3lJ9Nf252Y39FOYMgD','Kumpulan Kitab PDF',0,4)]
out=[]
for fid,name,d,md in roots:
    print('ROOT',name,flush=True); out.append(crawl(fid,name,d,md))
json.dump(out,open(os.path.join(ROOT,'scripts','kitab_tree.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
def files(n): return len(n['files'])+sum(files(c) for c in n.get('children',[]))
def folders(n): return len(n['children'])+sum(folders(c) for c in n.get('children',[]))
print('files',sum(files(r) for r in out),'folders',sum(folders(r) for r in out),flush=True)
