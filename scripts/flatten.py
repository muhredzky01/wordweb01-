import json,re,unicodedata

t=json.load(open('scripts/kitab_tree.json'))
root=t[0]
files=[]
def walk(n,top):
    for f in n.get('files',[]):
        files.append({**f,'top':top,'path':n['name']})
    for c in n.get('children',[]): walk(c,top or c['name'])
for c in root['children']: walk(c,c['name'])
print('files',len(files))
for f in files[:15]: print(f['top'],'|',f['name'])

VOL=re.compile(r'(?i)(?:\s*[-_]?\s*(?:jil(?:id)?|juz|jld|vol(?:ume)?|bag(?:ian)?)\s*[.:]?\s*\d+)|(?:\s*\(\s*\d+\s*\))|(?:\s+\d{1,3}\s*$)')
def base(name):
    n=re.sub(r'\.pdf$','',name,flags=re.I).strip()
    n=re.sub(r'\.(docx?|zip|epub)$','',n,flags=re.I)
    return VOL.sub('',n).strip(' -_.')
groups={}
for f in files:
    if f['name'].lower().endswith(('.pdf',)):
        k=(f['top'],base(f['name']).lower())
        groups.setdefault(k,[]).append(f)
print('groups',len(groups))
for k,v in sorted(groups.items(), key=lambda x:-len(x[1]))[:12]:
    print(len(v),'|',k[0],'|',k[1][:80])
json.dump(files,open('scripts/out/files.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
