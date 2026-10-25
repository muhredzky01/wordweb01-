import re, json, subprocess, os, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRY_RE = re.compile(r'<div class="flip-entry" id="entry-([^"]+)".*?aria-label="([^"]*)".*?<div class="flip-entry-title">(.*?)</div>', re.S)

def fetch(fid):
    out = f'/tmp/gd2_{fid}.html'
    if not os.path.exists(out) or os.path.getsize(out) < 500:
        subprocess.run(['curl','-sL','--max-time','60',f'https://drive.google.com/embeddedfolderview?id={fid}#list','-o',out], check=True)
    return open(out, encoding='utf-8', errors='ignore').read()

def parse(h):
    items=[]
    for m in ENTRY_RE.finditer(h):
        title=re.sub('<[^>]+>','',m.group(3)).replace('&#39;',"'").replace('&amp;','&').replace('&quot;','"').replace('&lt;','<').replace('&gt;','>')
        items.append({'id':m.group(1),'kind':'folder' if m.group(2)=='Folder' else 'file','title':title.strip()})
    return items

def crawl(fid,name,depth,maxdepth):
    try: items=parse(fetch(fid))
    except Exception as e: return {'id':fid,'name':name,'children':[],'files':[],'error':str(e)}
    node={'id':fid,'name':name,'children':[],'files':[]}
    for it in items:
        if it['kind']=='folder': node['children'].append({'id':it['id'],'name':it['title']})
        else: node['files'].append({'id':it['id'],'name':it['title']})
    if depth<maxdepth:
        for ch in node['children']:
            sub=crawl(ch['id'],ch['name'],depth+1,maxdepth)
            ch.update(sub)
    return node

roots=[('1Y4nlYY5Hpy_EyzTLlvHpntygblCIwi_g','Maktabah Kitab',0,3),
       ('1AbZ04AkNNlT6Wc3lJ9Nf252Y39FOYMgD','Kumpulan Kitab PDF',0,3)]
out=[]
for fid,name,d,md in roots:
    print('ROOT',name,flush=True); out.append(crawl(fid,name,d,md))
json.dump(out,open(os.path.join(ROOT,'scripts','kitab_tree.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
def files(n): return len(n['files'])+sum(files(c) for c in n.get('children',[]))
def folders(n): return len(n['children'])+sum(folders(c) for c in n.get('children',[]))
print('files',sum(files(r) for r in out),'folders',sum(folders(r) for r in out),flush=True)
