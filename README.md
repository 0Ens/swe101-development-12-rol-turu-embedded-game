# Engellerden Kaçma: Skorlu Mini Oyun

swe101-development-12 rol turu, Kapı B. TypeScript + HTML Canvas ile yazılmış, 3 şeritli küçük bir engelden kaçma oyunu.

> 🚧 Taslak: mekanik listesi tamamlandı, kod henüz yazılmadı.

## Mekanik listesi

### Ne hareket ediyor?
- **Oyuncu (küre):** ekranın altındadır. Yol 3 şerit genişliğindedir ve küre hep ileri gidiyormuş gibi görünür. Aslında yol ve nesneler aşağı doğru küreye akar.
- `A` tuşuna bir kez basınca küre bir şerit sola, `D` tuşuna basınca bir şerit sağa **kayarak** geçer. Hız: **320 px/s**.
- **Nesneler:** yukarıdan aşağı iner. Hız: **200 px/s**.
- Her **0,6 saniyede** bir yeni **sıra** gelir. Bir sırada 3 yuva vardır: **en fazla 2 kırmızı kutu**, **en fazla 1 yeşil daire**, kalan yuvalar boştur. En fazla 2 kırmızı olduğu için her sırada en az bir güvenli yuva bulunur. Her yuvaya **%70 kırmızı, %30 yeşil** oranıyla nesne konur, sınırlar aşılmayacak şekilde.
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
- Oyun-bitti ekranından yeniden başlatılabilir.

## Kurulum

_Yazılacak._

## Çalıştırma

_Yazılacak._

## Test

_Yazılacak._

## Ne öğrendim

_Öğrenci tarafından yazılacak._

## Karar notu

_Öğrenci tarafından yazılacak (3-5 cümle: bu tadım bana ne hissettirdi, Kapı A'yı neden seçmedim?)._
