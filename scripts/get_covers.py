import json,os,urllib.request,concurrent.futures
raw=json.load(open('scripts/out/catalog_raw.json'))['books']
feat={b['id'] for b in json.load(open('src/data/catalog.json'))['books'] if b['featured']}
os.makedirs('public/covers',exist_ok=True)

def one(b):
    out=f"public/covers/{b['id']}.jpg"
    if os.path.exists(out) and os.path.getsize(out)>2000: return 'skip'
    if not b.get('cover'): return 'nocover'
    src=json.load(open('scripts/out/files.json')) if False else None
    # raw thumb was stored on files; rebuild from catalog_raw? use drive thumbs json
    return None

# thumbs from files grouped by first id
files=json.load(open('scripts/out/files.json'))
thumb_by_id={}
for f in files:
    if f.get('thumb'): thumb_by_id[f['id']]=f['thumb']

def dl(item):
    bid,thumb=item
    out=f'public/covers/{bid}.jpg'
    if os.path.exists(out) and os.path.getsize(out)>2000: return 'skip'
    size='s400' if bid in feat else 's240'
    url=thumb.split('=')[0]+'='+size
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
        data=urllib.request.urlopen(req,timeout=45).read()
        if len(data)>2000:
            open(out,'wb').write(data)
            return len(data)
    except Exception as e:
        return 'ERR '+str(e)[:60]
    return 'small'

items=[]
for b in raw:
    # find first file thumb by driveId
    if b['driveId'] in thumb_by_id: items.append((b['id'],thumb_by_id[b['driveId']]))
print('items',len(items),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
    for i,r in enumerate(ex.map(dl,items)):
        if i%40==0: print(i,r,flush=True)
print('done',len(os.listdir('public/covers')),flush=True)
