// Oyunun kuralları: saf fonksiyonlar (DOM, canvas veya zaman erişimi yok).

export interface Kutu {
  x: number; // sol üst köşe
  y: number;
  w: number; // genişlik
  h: number; // yükseklik
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
