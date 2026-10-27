# Engellerden Kaçma: Skorlu Mini Oyun

swe101-development-12 rol turu, Kapı B. TypeScript + HTML Canvas ile yazılmış küçük bir engelden kaçma oyunu.

> 🚧 Taslak: mekanik listesi tamamlandı, kod henüz yazılmadı.

## Mekanik listesi

### Ne hareket ediyor?
- **Oyuncu:** ekranın altında, `A` (sol) ve `D` (sağ) tuşlarıyla yatay hareket eder. Hız: **320 px/s**.
- **Düşen nesneler:** yukarıdan aşağı düşer. Hız: **200 px/s**.
- Her **0,6 saniyede** bir yeni nesne düşer: **%70 kırmızı kutu**, **%30 yeşil daire**.
- Bütün hareketler delta time ile hesaplanır (`konum += hız × dt`), kare hızından bağımsızdır.

### Ne neyle çarpışıyor?
| Olay | Sonuç |
|---|---|
| Oyuncu yeşil daireye çarparsa | Skor **+10**, daire kaybolur |
| Oyuncu kırmızı kutuya çarparsa | **1 can** kaybedilir, kutu kaybolur |
| Yeşil daire yakalanmadan aşağıdan çıkarsa | Skor **-10** (skor **0'ın altına inmez**), daire kaybolur |
| Kırmızı kutu aşağıdan çıkarsa | Hiçbir şey olmaz, sessizce kaybolur |

- Çarpılan nesne hemen kaybolur. Böylece aynı nesne birden fazla karede puan veremez veya can götüremez.
- Çarpışma kutu (AABB) olarak hesaplanır. Yeşil dairenin de görünmez kare bir hitbox'ı vardır.
- **Kenar teması çarpışma sayılır.** Gerekçe: oyun basit, zorluğun bir kısmı buradan gelsin.

### Sınırlar
- Oyuncu ekrandan çıkamaz, kenara gelince durur (duvar).
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
