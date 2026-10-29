// Oyunun kuralları: saf fonksiyonlar (DOM, canvas veya zaman erişimi yok).

import {
  EKRAN_YUKSEKLIGI,
  EN_FAZLA_KIRMIZI,
  EN_FAZLA_YESIL,
  KIRMIZI_ORANI,
  SERIT_GENISLIGI,
  SERIT_SAYISI,
} from "./config";

export type NesneTuru = "kirmizi" | "yesil";

export interface Kutu {
  x: number; // sol üst köşe
  y: number;
  w: number; // genişlik
  h: number; // yükseklik
}

// konum += hız × dt: kare hızından bağımsız hareket.
export function ilerlet(konum: number, hiz: number, dt: number): number {
  return konum + hiz * dt;
}

// Hedefe doğru en fazla hız × dt kadar gider, hedefi geçmez.
export function hedefeKaydir(konum: number, hedef: number, hiz: number, dt: number): number {
  const adim = hiz * dt;
  if (Math.abs(hedef - konum) <= adim) return hedef;
  return konum + Math.sign(hedef - konum) * adim;
}

// yon: -1 sol, +1 sağ. En kenardaki şeritten öteye geçilmez (duvar).
export function seritDegistir(serit: number, yon: -1 | 1): number {
  return Math.min(SERIT_SAYISI - 1, Math.max(0, serit + yon));
}

export function seritMerkezi(serit: number): number {
  return serit * SERIT_GENISLIGI + SERIT_GENISLIGI / 2;
}

// Her yuva için %70 kırmızı / %30 yeşil seçilir; o tür için sınır dolduysa yuva boş (null) kalır.
// rastgele: 0 ile 1 arası sayı döndürür (oyunda Math.random, testte sabit değerler).
export function siraOlustur(rastgele: () => number): (NesneTuru | null)[] {
  const sira: (NesneTuru | null)[] = [];
  let kirmizi = 0;
  let yesil = 0;
  for (let i = 0; i < SERIT_SAYISI; i++) {
    if (rastgele() < KIRMIZI_ORANI) {
      if (kirmizi < EN_FAZLA_KIRMIZI) {
        sira.push("kirmizi");
        kirmizi++;
      } else {
        sira.push(null);
      }
    } else if (yesil < EN_FAZLA_YESIL) {
      sira.push("yesil");
      yesil++;
    } else {
      sira.push(null);
    }
  }
  return sira;
}

// Nesne, üst kenarı ekranın altını geçince kaçmış sayılır.
export function nesneKactiMi(y: number): boolean {
  return y > EKRAN_YUKSEKLIGI;
}

export const YESIL_PUANI = 10;

export function yesilYakalandi(skor: number): number {
  return skor + YESIL_PUANI;
}

// Ceza skoru 0'ın altına düşüremez.
export function yesilKacti(skor: number): number {
  return Math.max(0, skor - YESIL_PUANI);
}

export function kirmiziyaCarpti(can: number): number {
  return can - 1;
}

export function oyunBittiMi(can: number): boolean {
  return can <= 0;
}

// Kenar teması da çarpışma sayılır; bu yüzden ayrıklık kontrolünde `<` ve `>` kullanılır.
export function kutularCarpisiyorMu(a: Kutu, b: Kutu): boolean {
  const yataydaAyrik = a.x + a.w < b.x || a.x > b.x + b.w;
  const dikeydeAyrik = a.y + a.h < b.y || a.y > b.y + b.h;
  return !yataydaAyrik && !dikeydeAyrik;
}
