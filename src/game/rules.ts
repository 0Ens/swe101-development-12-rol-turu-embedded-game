// Oyunun kuralları: saf fonksiyonlar (DOM, canvas veya zaman erişimi yok).

export interface Kutu {
  x: number; // sol üst köşe
  y: number;
  w: number; // genişlik
  h: number; // yükseklik
}

// Kenar teması da çarpışma sayılır; bu yüzden ayrıklık kontrolünde `<` ve `>` kullanılır.
export function kutularCarpisiyorMu(a: Kutu, b: Kutu): boolean {
  const yataydaAyrik = a.x + a.w < b.x || a.x > b.x + b.w;
  const dikeydeAyrik = a.y + a.h < b.y || a.y > b.y + b.h;
  return !yataydaAyrik && !dikeydeAyrik;
}
