import json,re,unicodedata,hashlib,os

files=json.load(open('scripts/out/files.json'))
VOL=re.compile(r'''(?ix)
  (?:\s*[-_–]?\s*(?:jil(?:id)?|juz|jld|vol(?:ume)?|bag(?:ian)?|ج)\s*[.:]?\s*\d+)
 |(?:\s*\(\s*\d+\s*\))
 |(?:\s*[-_.]\s*\d{1,3}\s*$)
 |(?:\d{1,3}\s*$)
''')
def clean_name(name):
    n=re.sub(r'\.pdf$','',name,flags=re.I).strip()
    n=re.sub(r'\s+',' ',n)
    return n.strip(' -_.')
def base(name):
    n=clean_name(name)
    b=VOL.sub('',n).strip(' -_.')
    return b if len(b)>3 else n

TOP_CAT={
 'القرأن':'quran','الفوائد الشاطرية':'quran',
 'الحديث':"hadith","Al Mu'jam Al Kabir":'hadith',
 'الفقه':'fiqh',
 'الاخلاق':'tasawuf','شرح الحكم':'tasawuf','شجرة المعارف':'tasawuf','ميزان الكبرى':'tasawuf','فتوحات المكية':'tasawuf',
 'الاصول':'ushul','حول الوقف':'ushul',
 'التاريخ':'sirah','عن فاطمة':'sirah','رجب':'sirah','زاد المعاد':'sirah',
 'النحو والصرف':'language',
 'الكلام':'aqidah',
 'Rotib':'doa',
 'Buku dan Terjemah':'terjemahan',
}
CATS={
 'quran':{'name':"Al-Qur'an & Tafsir",'arabic':'القرآن والتفسير','color':'#6C5CE7','light':'#EEEBFF'},
 'hadith':{'name':'Hadis & Ulumul Hadis','arabic':'الحديث','color':'#0F9D76','light':'#E4F7F1'},
 'fiqh':{'name':'Fikih & Fatwa','arabic':'الفقه','color':'#E4572E','light':'#FDEDE7'},
 'aqidah':{'name':'Akidah & Kalam','arabic':'العقيدة والكلام','color':'#2E6BE6','light':'#E8F0FE'},
 'tasawuf':{'name':'Akhlak & Tasawuf','arabic':'الأخلاق والتصوف','color':'#8E44AD','light':'#F5EAFB'},
 'sirah':{'name':'Sirah & Sejarah','arabic':'السيرة والتاريخ','color':'#B7791F','light':'#FCF3E1'},
 'ushul':{'name':'Ushul & Qawaid','arabic':'الأصول والقواعد','color':'#0E7490','light':'#E3F4F8'},
 'language':{'name':'Bahasa Arab','arabic':'اللغة العربية','color':'#C2410C','light':'#FFF0E6'},
 'doa':{'name':'Doa & Wirid','arabic':'الأدعية والأوراد','color':'#BE185D','light':'#FCE8F1'},
 'terjemahan':{'name':'Terjemahan & Kajian','arabic':'الترجمة والدراسة','color':'#4F46E5','light':'#ECEBFF'},
}

AUTHORS=[
 ('تفسير الطبري','Imam Ath-Thabari'),('الطبري','Imam Ath-Thabari'),
 ('الجامع لأحكام القرآن','Imam Al-Qurthubi'),
 ('روح البيان','Ismail Haqqi Bursawi'),
 ('tafsir al-azhar','Buya Hamka'),
 ('سنن الكبرى للبيهقي','Imam Al-Baihaqi'),
 ('التمهيد','Ibnu Abdil Barr'),('الاستذكار','Ibnu Abdil Barr'),
 ('الفتوحات الربانية','Syaikh Abdul Qadir Al-Jilani'),
 ('futuhat makiyyah','Ibnu Arabi'),('الفتوحات المكية','Ibnu Arabi'),
 ('al fiqh al islam wa adillatuhu','Dr. Wahbah Az-Zuhaili'),
 ('Bughyatul Mustarsyidin','Habib Abdurrahman Al-Masyhur'),
 ('Fathul Qorib','Ibnu Qasim Al-Ghazi'),
 ('Bidayah Al Hidayah','Imam Al-Ghazali'),
 ('Al Akhlaq lil Banin','Umar bin Ahmad Baraja'),
 ("Al Muwaththa' Malik",'Imam Malik bin Anas'),
 ("Al Wafi syarah Arba'in",'Musthafa Dieb Al-Bugha'),
 ('Syarah Mahalli','Jalaluddin Al-Mahalli'),
 ("Zadul Ma'ad",'Ibnu Qayyim Al-Jauziyyah'),
 ("Syajarah Al Ma'arif",'Syaikh Ihsan Jampes'),
 ('Ratib Al Haddad','Habib Abdullah Al-Haddad'),
 ("Al Itqan fi 'Ulum Al Qur'an",'Imam As-Suyuthi'),
 ('At Tibyan An Nawawi','Imam An-Nawawi'),
 ("Al Amtsilah At Tashrifiyyah",'Syaikh Muhammad Ma\'ruf'),
 ('Al Mumti\'','Ibnu Utsaimin'),
 ("Asy Syifa",'Qadhi Iyadh'),
 ('Asy Syamail','Imam At-Tirmidzi'),
 ('المعجم الكبير للطبراني','Imam Ath-Thabarani'),
 ('Fiqh As Sunnah','Sayyid Sabiq'),
 ('Syarah Arba','Imam An-Nawawi'),
 ('الموطأ','Imam Malik bin Anas'),
 ('صحيح البخاري','Imam Al-Bukhari'),
 ('صحيح مسلم','Imam Muslim'),
 ('رياض الصالحين','Imam An-Nawawi'),
 ('الحكم العطائية','Syaikh Ahmad bin Athaillah'),
 ('الفوائد الشاطرية','Imam Asy-Syathibi'),
 ('الميزان الكبرى','Syaikh Abdul Wahab Asy-Sya\'rani'),
 ('إحياء علوم الدين','Imam Al-Ghazali'),
]

def detect_lang(title):
    low=title.lower()
    if 'makna' in low or 'petuk' in low or 'terj' in low: return 'Makna Pesantren'
    if re.search(r'[\u0600-\u06FF]',title): return 'Arab'
    return 'Indonesia'

def slugify(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode()
    s=re.sub(r"[^a-zA-Z0-9]+",'-',s).strip('-').lower()
    return s[:70]

groups={}
for f in files:
    if not f['name'].lower().endswith('.pdf'): continue
    b=base(f['name'])
    k=(f['top'],b.lower())
    groups.setdefault(k,{'top':f['top'],'title':b,'files':[]})['files'].append(f)

books=[]
seen=set()
for i,(k,g) in enumerate(sorted(groups.items(),key=lambda kv:(kv[0][0],kv[0][1]))):
    title=g['title']
    cat=TOP_CAT.get(g['top'],'terjemahan')
    author='Koleksi Maktabah Kitab'
    for kw,a in AUTHORS:
        if kw.lower() in title.lower(): author=a; break
    langs=[detect_lang(v['name']) for v in g['files']]
    lang='Arab' if 'Arab' in langs else ('Makna Pesantren' if 'Makna Pesantren' in langs else 'Indonesia')
    slug=slugify(title) or 'kitab'
    if slug in seen: slug=f"{slug}-{i}"
    seen.add(slug)
    bid=f'k{i+1:03d}'
    books.append({
      'id':bid,'slug':slug,'title':title,'author':author,'category':cat,
      'collection':g['top'],'language':lang,'volumes':len(g['files']),
      'driveId':g['files'][0]['id'],'files':[{'name':v['name'],'id':v['id']} for v in g['files']],
      'cover':f'/covers/{bid}.jpg' if g['files'][0].get('thumb') else None,
      'modified':g['files'][0].get('modified')
    })
json.dump({'categories':CATS,'books':books},open('scripts/out/catalog_raw.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('books',len(books))
for b in books:
    print(b['category'],'|',b['title'],'|',b['author'],'|',b['volumes'])
