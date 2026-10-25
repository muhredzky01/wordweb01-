import json,re,hashlib,os
raw=json.load(open('scripts/out/catalog_raw.json'))
books=raw['books']; cats=raw['categories']

CURATED={
'k205':dict(title='Tafsir Al-Azhar',author='Buya Hamka',arabic='تفسير الأزهر',subtitle="Tafsir Al-Qur'an 30 juz dalam bahasa Indonesia",era='modern',
 desc='Tafsir lengkap 30 juz karya Buya Hamka yang ditulis dengan gaya sastra dan konteks keindonesiaan. Setiap surah dibahas dengan pengantar, munasabah, dan penjelasan makna yang dekat dengan persoalan umat.',tags=['Tafsir','Indonesia','Modern']),
'k195':dict(title="Al-Itqan fi 'Ulum Al-Qur'an",author='Imam As-Suyuthi',arabic='الإتقان في علوم القرآن',subtitle='Ensiklopedia ilmu-ilmu Al-Qur’an',era='klasik',
 desc='Rujukan utama ulumul Qur’an yang merangkum sekitar 80 pembahasan, dari turunnya wahyu, qira’at, nasikh-mansukh, hingga adab membaca Al-Qur’an. Ditulis oleh Imam As-Suyuthi, polymath abad ke-15.',tags=['Ulumul Qur’an','Klasik']),
'k079':dict(title='Shahih Bukhari',author='Imam Al-Bukhari',arabic='صحيح البخاري',subtitle='Kitab hadis paling sahih setelah Al-Qur’an',era='klasik',
 desc='Kumpulan hadis Nabi ﷺ yang disusun Imam Al-Bukhari dengan syarat keshahihan sangat ketat. Menjadi rujukan pertama dalam kajian hadis dan sunnah.',tags=['Hadis','Shahih']),
'k078':dict(title='Riyadhus Shalihin',author='Imam An-Nawawi',arabic='رياض الصالحين',subtitle='Taman orang-orang saleh',era='klasik',
 desc='Kumpulan hadis pilihan tentang akhlak, ibadah, dan muamalah yang disusun Imam An-Nawawi. Cocok untuk kajian harian, majelis, dan pembinaan karakter.',tags=['Hadis','Akhlak']),
'k073':dict(title="Al-Muwaththa' Imam Malik",author='Imam Malik bin Anas',arabic='الموطأ',subtitle='Hadis dan fikih Madinah',era='klasik',
 desc='Kitab hadis dan fikih tertua yang tersusun sistematis, memadukan riwayat Nabi ﷺ dengan praktik penduduk Madinah. Dasar penting mazhab Maliki.',tags=['Hadis','Fikih','Maliki']),
'k085':dict(title='Sunan At-Tirmidzi',author='Imam At-Tirmidzi',arabic='سنن الترمذي',subtitle='Jami’ At-Tirmidzi',era='klasik',
 desc='Salah satu kitab hadis enam (kutubus sittah) yang memuat hadis ahkam, adab, tafsir, dan sejarah, lengkap dengan penilaian derajat hadis dari penulisnya.',tags=['Hadis','Sunan']),
'k108':dict(title='Al-Fiqh Al-Islami wa Adillatuhu',author='Dr. Wahbah Az-Zuhaili',arabic='الفقه الإسلامي وأدلته',subtitle='Fikih komparatif empat mazhab',era='modern',
 desc='Ensiklopedia fikih delapan jilid yang membandingkan pandangan empat mazhab beserta dalilnya. Rujukan modern paling luas dipakai di pesantren dan kampus.',tags=['Fikih','Mazhab','Modern']),
'k112':dict(title='Fathul Qarib',author='Ibnu Qasim Al-Ghazi',arabic='فتح القريب',subtitle='Syarah Matan Taqrib',era='klasik',
 desc='Syarah ringkas dan jelas atas Matan Taqrib, kitab fikih mazhab Syafi’i tingkat dasar. Pintu masuk pertama bagi santri untuk memahami ibadah dan muamalah.',tags=['Fikih','Syafi’i','Dasar']),
'k114':dict(title='Fiqh As-Sunnah',author='Sayyid Sabiq',arabic='فقه السنة',subtitle='Fikih berdasarkan Al-Qur’an dan Sunnah',era='modern',
 desc='Pembahasan fikih yang berorientasi dalil, disusun tematik dari thaharah hingga waris. Gaya bahasanya mudah dan banyak dipakai untuk kajian mandiri.',tags=['Fikih','Dalil']),
'k109':dict(title='Bidayatul Hidayah',author='Imam Al-Ghazali',arabic='بداية الهداية',subtitle='Permulaan jalan menuju hidayah',era='klasik',
 desc='Ringkasan praktis dari Ihya’ Ulumuddin tentang adab, ibadah, dan penyucian hati. Panduan harian bagi penuntut ilmu yang ingin memperbaiki amal.',tags=['Tasawuf','Adab']),
'k049':dict(title='Al-Akhlaq lil Banin',author='Umar bin Ahmad Baraja',arabic='الأخلاق للبنين',subtitle='Pendidikan akhlak untuk anak',era='modern',
 desc='Buku akhlak berbahasa sederhana untuk anak dan remaja, disusun dalam beberapa jilid. Berisi kisah, nasihat, dan adab sehari-hari yang mudah dicerna.',tags=['Akhlak','Anak']),
'k051':dict(title="Ta'lim Al-Muta'allim",author='Syaikh Az-Zarnuji',arabic='تعليم المتعلم',subtitle='Metode belajar bagi penuntut ilmu',era='klasik',
 desc='Kitab klasik tentang adab dan metode menuntut ilmu: niat, memilih guru, menghormati ilmu, hingga strategi belajar. Wajib dibaca setiap santri baru.',tags=['Adab','Metode Belajar']),
'k329':dict(title='Futuhat Al-Makiyyah',author='Ibnu Arabi',arabic='الفتوحات المكية',subtitle='Mawaqi’ An-Nujum',era='klasik',
 desc='Karya raksasa tasawuf metafisika dalam sembilan jilid yang membahas ma’rifat, wujud, dan perjalanan ruhani. Teks klasik yang paling banyak dikaji dalam tradisi sufi.',tags=['Tasawuf','Metafisika']),
'k318':dict(title="Syajarah Al-Ma'arif",author='Syaikh Ihsan Jampes',arabic='شجرة المعارف',subtitle='Pohon pengetahuan',era='klasik',
 desc='Karya ulama Nusantara Syaikh Ihsan Jampes tentang tauhid, tauhid, dan jalan menuju ma’rifatullah. Bukti kedalaman tradisi keilmuan pesantren.',tags=['Tasawuf','Nusantara']),
'k046':dict(title='Ratib Al-Haddad',author='Habib Abdullah Al-Haddad',arabic='راتب الحداد',subtitle='Wirid dan dzikir harian',era='klasik',
 desc='Kumpulan wirid yang disusun Habib Abdullah Al-Haddad untuk diamalkan setiap malam. Teks Arab lengkap dengan panduan baca.',tags=['Wirid','Doa']),
'k066':dict(title='Asy-Syamail Al-Muhammadiyyah',author='Imam At-Tirmidzi',arabic='الشمائل المحمدية',subtitle='Sifat dan akhlak Nabi ﷺ',era='klasik',
 desc='Rekaman hadis tentang rupa, akhlak, dan kebiasaan Nabi ﷺ dalam kehidupan sehari-hari. Membaca kitab ini menghadirkan kecintaan kepada Rasulullah.',tags=['Hadis','Sirah']),
'k068':dict(title='Tarikh Al-Khulafa',author='Imam As-Suyuthi',arabic='تاريخ الخلفاء',subtitle='Sejarah para khalifah',era='klasik',
 desc='Ringkasan sejarah kekhalifahan sejak Abu Bakar hingga masa penulis, lengkap dengan profil dan kebijakan para khalifah.',tags=['Sejarah','Khulafa']),
'k271':dict(title='Al-Amtsilah At-Tashrifiyyah',author="Syaikh Muhammad Ma'ruf",arabic='الأمثلة التصريفية',subtitle='Ilmu sharaf dalam tabel',era='klasik',
 desc='Buku saku ilmu sharaf yang menyajikan kaidah dan contoh tashrif secara ringkas dan terstruktur. Pegangan wajib pemula bahasa Arab.',tags=['Bahasa Arab','Sharaf']),
'k202':dict(title='Muqaddimah Al-Jazariyyah',author='Ibn Al-Jazari',arabic='المقدمة الجزرية',subtitle='Nazham dasar ilmu tajwid',era='klasik',
 desc='Nazham ringkas tentang makhraj, sifat huruf, dan kaidah tajwid yang menjadi kurikulum dasar di pesantren dan lembaga tahsin.',tags=['Tajwid','Nazham']),
'k204':dict(title='Tafsir Al-Jalalain',author='Jalaluddin Al-Mahalli & As-Suyuthi',arabic='تفسير الجلالين',subtitle='Tafsir ringkas 30 juz',era='klasik',
 desc='Tafsir paling ringkas dan populer di dunia Islam, menjelaskan makna ayat dengan bahasa yang padat. Cocok untuk pembaca yang sudah menguasai dasar bahasa Arab.',tags=['Tafsir','Ringkas']),
'k196':dict(title="Al-Mufradat fi Gharib Al-Qur'an",author='Ar-Raghib Al-Asfahani',arabic='المفردات في غريب القرآن',subtitle='Kamus kosakata Al-Qur’an',era='klasik',
 desc='Kamus tematik kata-kata langka dalam Al-Qur’an yang menjelaskan makna, akar kata, dan penggunaannya. Rujukan utama para mufassir.',tags=['Ulumul Qur’an','Leksikon']),
'k116':dict(title='Kanzur Raghibin',author='Syaikh Muhammad Nawawi Al-Bantani',arabic='كنز الراغبين',subtitle='Syarah Minhajut Thalibin',era='klasik',
 desc='Syarah atas Minhajut Thalibin karya Imam An-Nawawi, membahas fikih Syafi’i secara luas namun sistematis. Karya ulama Nusantara yang mendunia.',tags=['Fikih','Syafi’i']),
'k119':dict(title='Nihayatuz Zain',author='Syaikh Muhammad Nawawi Al-Bantani',arabic='نهاية الزين',subtitle='Syarah Qurratul ‘Ain',era='klasik',
 desc='Penjelasan fikih ibadah dan muamalah dasar dalam mazhab Syafi’i, ditulis dengan bahasa yang mudah dan banyak dipakai di pesantren.',tags=['Fikih','Dasar']),
'k121':dict(title='Sullam At-Taufiq',author="Syaikh Abdullah Ba'alawi",arabic='سلم التوفيق',subtitle='Tangga menuju ketakwaan',era='klasik',
 desc='Matan fikih dan akhlak yang ringkas, membahas rukun Islam, iman, serta adab sehari-hari. Pintu masuk fikih bagi pemula.',tags=['Fikih','Akhlak']),
'k120':dict(title='Safinat An-Najah',author='Syaikh Salim bin Sumair Al-Hadhrami',arabic='سفينة النجاة',subtitle='Perahu keselamatan',era='klasik',
 desc='Matan fikih dasar mazhab Syafi’i yang sangat ringkas dan telah dikaji selama berabad-abad di seluruh dunia Islam.',tags=['Fikih','Dasar']),
'k110':dict(title="Fathul Mu'in",author='Zainuddin Al-Malibari',arabic="فتح المعين",subtitle='Syarah Qurratul ‘Ain',era='klasik',
 desc='Syarah fikih Syafi’i yang mendalam atas Qurratul ‘Ain, membahas ibadah dan muamalah dengan uraian yang kaya.',tags=['Fikih','Syafi’i']),
'k074':dict(title="Al-Wafi fi Syarh Al-Arba'in",author='Musthafa Dieb Al-Bugha',arabic='الوافي في شرح الأربعين',subtitle='Syarah 40 hadis An-Nawawi',era='modern',
 desc='Penjelasan kontemporer atas 40 hadis pilihan Imam An-Nawawi, menghubungkan teks hadis dengan persoalan akidah, akhlak, dan kehidupan modern.',tags=['Hadis','Syarah']),
'k023':dict(title='Ar-Rahiq Al-Makhtum',author='Safiyyurrahman Al-Mubarakfuri',arabic='الرحيق المختوم',subtitle='Sirah Nabi ﷺ',era='modern',
 desc='Sirah Nabi Muhammad ﷺ yang memenangkan lomba penulisan biografi di Makkah. Kronologis, kaya sumber, dan mudah dibaca.',tags=['Sirah','Nabi']),
'k028':dict(title='Durratun Nashihin',author='Utsman Al-Khaubawi',arabic='درة الناصحين',subtitle='Mutiara nasihat',era='klasik',
 desc='Kumpulan kisah, nasihat, dan hikmah untuk membentuk akhlak, banyak dibaca di majelis dan pesantren Nusantara.',tags=['Nasihat','Kisah']),
'k026':dict(title='Ayyuhal Walad',author='Imam Al-Ghazali',arabic='أيها الولد',subtitle='Wahai anakku',era='klasik',
 desc='Surat nasihat Imam Al-Ghazali kepada muridnya tentang ilmu yang bermanfaat, amal, dan hubungan dengan guru.',tags=['Tasawuf','Nasihat']),
'k038':dict(title='Nurul Yaqin',author='Syaikh Muhammad Al-Khudhari Bek',arabic='نور اليقين',subtitle='Sirah Nabi ﷺ',era='klasik',
 desc='Ringkasan sirah Nabi ﷺ yang sistematis dan ringkas, menjadi kurikulum sirah di banyak madrasah.',tags=['Sirah','Dasar']),
'k118':dict(title='Nail Ar-Raja',author='Syaikh Ahmad bin Umar Asy-Syathiri',arabic='نيل الرجا',subtitle='Syarah Safinat An-Najah',era='klasik',
 desc='Syarah atas Safinat An-Najah yang menjelaskan fikih dasar mazhab Syafi’i langkah demi langkah.',tags=['Fikih','Syarah']),
}

PALETTES=[('#3b2f63','#6c5ce7'),('#123c34','#0f9d76'),('#4a1f1f','#e4572e'),('#14274e','#2e6be6'),('#3d1d47','#8e44ad'),('#4b3413','#b7791f'),('#093c46','#0e7490'),('#4a1c0a','#c2410c'),('#4a1030','#be185d')]

def slug(t):
    s=re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-')
    return s[:70] or 'kitab'

for i,b in enumerate(books):
    h=int(hashlib.md5(b['id'].encode()).hexdigest(),16)
    b['rating']=round(4.2+(h%9)/10,1)
    b['readers']=300+h%9700
    b['featured']=b['id'] in CURATED
    b['era']='klasik'
    b['tags']=[cats[b['category']]['name']]
    b['subtitle']=''
    b['description']=f"{b['title']} merupakan bagian dari koleksi {cats[b['category']]['name']} di Maktabah Kitab. Tersedia lengkap dalam format PDF" + (f" sebanyak {b['volumes']} jilid" if b['volumes']>1 else '') + ", dapat dibaca langsung maupun diunduh secara gratis."
    b['accent']=PALETTES[h%len(PALETTES)]
    if b['category']=='terjemahan': b['era']='modern'
    if b['id'] in CURATED:
        cur = dict(CURATED[b['id']])
        desc = cur.pop('desc', '')
        b.update(cur)
        if desc:
            b['description'] = desc
        b['rating']=round(4.6+(h%4)/10,1)
        b['readers']=3200+h%8800
        b['featured']=True
    b['title']=re.sub(r'\s+',' ',b['title']).strip()
    if b['title'].isupper() or '_' in b['title']:
        b['title']=b['title'].replace('_',' ').title()
    b['slug']=slug(b['title'])+'-'+b['id']
    b.setdefault('arabic','')

# fix known mappings
for b in books:
    if b['id']=='k206':
        b['title']='Tafsir Al-Azhar (Jilid 1 — salinan)'
        b['slug']='tafsir-al-azhar-jilid-1-salinan-k206'
    if b['id']=='k087':
        b['author']='Syaikh Ibnu Utsaimin'
    t=b['title'].lower()
    if 'bughyatul mustarsyidin' in t and b['volumes']>=2: b['author']='Habib Abdurrahman Al-Masyhur'
    if 'as syifa' in t: b['author']='Koleksi Maktabah Kitab'
    if b['title']=='Tarikh Al Khulafa': b['author']='Imam As-Suyuthi'
    if 'muqaddimah jazariyyah' in t: b['author']='Ibn Al-Jazari'

books.sort(key=lambda b:(not b['featured'], b['category'], b['title'].lower()))
meta={'categories':cats,'books':books,'collections':{},'generated':'2026-10-25'}
from collections import Counter
meta['collections']={k:v for k,v in Counter(b['collection'] for b in books).items()}
json.dump(meta,open('src/data/catalog.json','w',encoding='utf-8'),ensure_ascii=False)
print('books',len(books),'featured',sum(b['featured'] for b in books))
