// Oyun durumu ve her karede çağrılan saf adım fonksiyonu.
// Kuralların kendisi rules.ts'te; burada sadece sırayla uygulanırlar.

import {
  BASLANGIC_CANI,
  KURE_BOYUTU,
  KURE_HIZI,
  KURE_Y,
  NESNE_BOYUTU,
  NESNE_HIZI,
  SIRA_ARALIGI,
} from "./config";
import {
  hedefeKaydir,
  ilerlet,
  kirmiziyaCarpti,
  kutularCarpisiyorMu,
  nesneKactiMi,
  oyunBittiMi,
  seritDegistir,
  seritMerkezi,
  siraOlustur,
  yesilKacti,
  yesilYakalandi,
  type Kutu,
  type NesneTuru,
} from "./rules";

export interface Nesne {
  tur: NesneTuru;
  serit: number;
  y: number; // üst kenar
}

export interface OyunDurumu {
  kureSerit: number; // hedef şerit
  kureX: number; // kürenin merkezi; şerit değiştirirken iki şerit arasında olabilir
  nesneler: Nesne[];
  skor: number;
  can: number;
  siraSayaci: number; // son sıradan beri geçen süre (saniye)
  bitti: boolean;
}

export interface Girdi {
  yon: -1 | 0 | 1; // bu karede basılan tuş: sol, yok, sağ
}

export function baslangicDurumu(): OyunDurumu {
  return {
    kureSerit: 1,
    kureX: seritMerkezi(1),
    nesneler: [],
    skor: 0,
    can: BASLANGIC_CANI,
    siraSayaci: 0,
    bitti: false,
  };
}

export function kureKutusu(kureX: number): Kutu {
  return { x: kureX - KURE_BOYUTU / 2, y: KURE_Y, w: KURE_BOYUTU, h: KURE_BOYUTU };
}

export function nesneKutusu(n: Nesne): Kutu {
  return { x: seritMerkezi(n.serit) - NESNE_BOYUTU / 2, y: n.y, w: NESNE_BOYUTU, h: NESNE_BOYUTU };
}

export function oyunuIlerlet(
  durum: OyunDurumu,
  girdi: Girdi,
  dt: number,
  rastgele: () => number,
): OyunDurumu {
  if (durum.bitti) return durum;

  // 1. Küre
  const kureSerit = girdi.yon === 0 ? durum.kureSerit : seritDegistir(durum.kureSerit, girdi.yon);
  const kureX = hedefeKaydir(durum.kureX, seritMerkezi(kureSerit), KURE_HIZI, dt);

  // 2. Nesneler aşağı iner, vakti geldiyse yeni sıra eklenir (ekranın hemen üstünde)
  const nesneler = durum.nesneler.map((n) => ({ ...n, y: ilerlet(n.y, NESNE_HIZI, dt) }));
  let siraSayaci = durum.siraSayaci + dt;
  if (siraSayaci >= SIRA_ARALIGI) {
    siraSayaci -= SIRA_ARALIGI;
    siraOlustur(rastgele).forEach((tur, serit) => {
      if (tur !== null) nesneler.push({ tur, serit, y: -NESNE_BOYUTU });
    });
  }

  // 3. Çarpışan ya da kaçan nesneler kuralları uygular ve kaybolur
  let skor = durum.skor;
  let can = durum.can;
  const kure = kureKutusu(kureX);
  const kalanlar: Nesne[] = [];
  for (const n of nesneler) {
    if (kutularCarpisiyorMu(kure, nesneKutusu(n))) {
      if (n.tur === "yesil") skor = yesilYakalandi(skor);
      else can = kirmiziyaCarpti(can);
    } else if (nesneKactiMi(n.y)) {
      if (n.tur === "yesil") skor = yesilKacti(skor);
    } else {
      kalanlar.push(n);
    }
  }

  return { kureSerit, kureX, nesneler: kalanlar, skor, can, siraSayaci, bitti: oyunBittiMi(can) };
}
