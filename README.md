# Engellerden Kaçma: Skorlu Mini Oyun

swe101-development-12 rol turu, Kapı B. TypeScript + HTML Canvas ile yazılmış, 3 şeritli küçük bir engelden kaçma oyunu.

**Kontroller:** `A` sol şerit, `D` sağ şerit, `Space` oyun bitince yeniden başlat.

## Mekanik listesi

### Ne hareket ediyor?
- **Oyuncu (küre):** ekranın altındadır. Yol 3 şerit genişliğindedir ve küre hep ileri gidiyormuş gibi görünür. Aslında yol ve nesneler aşağı doğru küreye akar.
- `A` tuşuna bir kez basınca küre bir şerit sola, `D` tuşuna basınca bir şerit sağa **kayarak** geçer. Hız: **800 px/s** (bir şerit 0,2 saniye).
- **Nesneler:** yukarıdan aşağı iner. Hız: **200 px/s**.
- Her **1 saniyede** bir yeni **sıra** gelir. Bir sırada 3 yuva vardır: **en fazla 2 kırmızı kutu**, **en fazla 1 yeşil daire**, kalan yuvalar boştur. En fazla 2 kırmızı olduğu için her sırada en az bir güvenli yuva bulunur. Her yuvaya **%70 kırmızı, %30 yeşil** oranıyla nesne konur, sınırlar aşılmayacak şekilde.
- Bütün hareketler delta time ile hesaplanır (`konum += hız × dt`), kare hızından bağımsızdır.

### Ne neyle çarpışıyor?
| Olay | Sonuç |
|---|---|
| Oyuncu yeşil daireye çarparsa | Skor **+10**, daire kaybolur |
| Oyuncu kırmızı kutuya çarparsa | **1 can** kaybedilir, kutu kaybolur |
| Yeşil daire yakalanmadan aşağıdan çıkarsa | Skor **-10** (skor **0'ın altına inmez**), daire kaybolur |
| Kırmızı kutu aşağıdan çıkarsa | Hiçbir şey olmaz, sessizce kaybolur |

- Çarpılan nesne hemen kaybolur. Böylece aynı nesne birden fazla karede puan veremez veya can götüremez.
- Çarpışma kutu (AABB) olarak hesaplanır. Küre ve yeşil dairenin de görünmez kare birer hitbox'ı vardır. Küre şerit değiştirirken iki şeridin arasında olabileceği için çarpışma şerit numarasına göre değil, gerçek konuma göre hesaplanır.
- **Kenar teması çarpışma sayılır.** Gerekçe: oyun basit, zorluğun bir kısmı buradan gelsin.

### Sınırlar
- Oyuncu ekrandan çıkamaz: en soldaki şeritte `A`, en sağdaki şeritte `D` etkisizdir (duvar).
- Bir nesne, üst kenarı ekranın altını geçtiğinde "kaçmış" sayılır.

### Skor, can ve oyunun bitişi
- Oyun **3 canla** başlar, skor 0'dan başlar.
- Can **0** olunca oyun biter ve oyun-bitti ekranı gösterilir.
- Oyun-bitti ekranında `Space` ile yeniden başlatılır.

### Ayar değişikliği (oynayarak test sonrası)
İlk değerler (küre 320 px/s, her 0,6 saniyede bir sıra) ile en soldan en sağa geçmek 1 saniye sürüyordu. Bu süre sıralar arasındaki boşluktan uzundu, bu yüzden bazı yeşil dairelere kırmızıya çarpmadan ulaşmak imkânsızdı ve kaçan yeşil haksız yere puan götürüyordu. Küre hızı 800 px/s'ye, sıra aralığı 1 saniyeye çıkarıldı. Bütün ayarlar `src/game/config.ts` dosyasında.

## Kurulum

Gereksinim: [Node.js](https://nodejs.org) 20 veya üstü.

```bash
git clone https://github.com/0Ens/swe101-development-12-rol-turu-embedded-game.git
cd swe101-development-12-rol-turu-embedded-game
npm install
```

## Çalıştırma

```bash
npm run dev
```
Terminalde yazan adresi (genelde `http://localhost:5173`) tarayıcıda açın.

Yayına hazır statik dosyalar için `npm run build` (çıktı `dist/` klasörüne yazılır).

## Test

```bash
npm test
```
Tek bir testi adıyla çalıştırmak için: `npx vitest run -t "kenar teması"`

Testler oyunun bütün kurallarını, tarayıcı açmadan kontrol eder:
- **Çarpışma:** üst üste binme, iki eksende ayrıklık, iki eksende kenar teması (çarpışma sayılır), 1 piksel boşluk
- **Skor:** yeşil yakalanınca +10, kaçınca -10, skor tam 10 iken ve 0 iken kaçırma (0'ın altına inmez)
- **Can ve oyunun bitişi:** son can ile kırmızıya çarpma, can 0 iken oyunun bitmesi, oyun bittikten sonra durumun donması
- **Hareket:** 60 FPS ve 30 FPS'te 1 saniye sonunda aynı konuma varılması (delta time), kürenin hedef şeridi geçmemesi, kenar şeritte duvar
- **Sıra oluşturma:** en fazla 2 kırmızı ve 1 yeşil, rastgele sayının tam 0,7 olması (sınır)

## Proje yapısı

```
src/game/config.ts   Ayarlar (hızlar, boyutlar, oranlar)
src/game/rules.ts    Saf kural fonksiyonları: çarpışma, skor, can, hareket, sıra oluşturma
src/game/state.ts    Oyun durumu ve her karede çağrılan saf oyunuIlerlet(durum, girdi, dt, rastgele)
src/main.ts          Tarayıcı: klavye, requestAnimationFrame döngüsü ve çizim. Oyun kuralı içermez.
tests/               Vitest testleri
```

Kuralların hiçbiri DOM'a, canvas'a ya da saate dokunmaz. Rastgelelik bile parametre olarak verilir (oyunda `Math.random`, testte sabit değerler). Bu sayede bütün oyun mantığı tarayıcı olmadan test edilebilir.

## Ne öğrendim

_Öğrenci tarafından yazılacak._

## Karar notu

Bu proje bana genel olarak zor geldi, çünkü diğer projelerime göre daha karışıktı: düşünmemiz gereken çok hesap vardı ve bu kadar çok mikro durumu düşünmek beni yordu. Oyun geliştirme şu an için bana göre değil; profesyonel alanımı ilk defa seçeceğim ve yaparken doğrudan zevk aldığım bir alan olması benim için önemli. Projeye başlamadan önce de oyun yapma sevdam yoktu, bu yüzden yaparken biraz işkence gibi geldi; sanırım oynama kısmı benim için daha eğlenceli. :D Yine de yaptığımız her değişiklikten sonra oyunu local server'da test etmek zevkliydi. Kapı A'yı seçmedim, çünkü oyun tarafının da ilgi çekici olabileceğini düşündüm; ama onu da bir ara yapacağım.
