import { describe, expect, it } from "vitest";
import { EKRAN_YUKSEKLIGI, KURE_HIZI, KURE_Y, NESNE_BOYUTU, SIRA_ARALIGI } from "../src/game/config";
import { baslangicDurumu, oyunuIlerlet, type Nesne, type OyunDurumu } from "../src/game/state";

const hicKimse = { yon: 0 } as const;
const hepKirmizi = () => 0;

// Başlangıç durumunu verilen alanlarla değiştirir.
const durum = (degisen: Partial<OyunDurumu> = {}): OyunDurumu => ({ ...baslangicDurumu(), ...degisen });

// Kürenin tam üstünde, ortadaki şeritte duran nesne.
const kureyeDegen = (tur: Nesne["tur"]): Nesne => ({ tur, serit: 1, y: KURE_Y });

describe("oyunuIlerlet", () => {
  it("oyun 3 can, 0 skor ve ortadaki şeritte başlar", () => {
    const d = baslangicDurumu();
    expect(d.can).toBe(3);
    expect(d.skor).toBe(0);
    expect(d.kureSerit).toBe(1);
    expect(d.kureX).toBe(240);
  });

  it("D tuşu hedef şeridi değiştirir, küre o yöne kaymaya başlar", () => {
    const sonra = oyunuIlerlet(durum(), { yon: 1 }, 0.1, hepKirmizi);
    expect(sonra.kureSerit).toBe(2);
    expect(sonra.kureX).toBeCloseTo(240 + KURE_HIZI * 0.1);
  });

  it("kırmızıya çarpınca 1 can gider ve kırmızı kaybolur", () => {
    const sonra = oyunuIlerlet(durum({ nesneler: [kureyeDegen("kirmizi")] }), hicKimse, 0, hepKirmizi);
    expect(sonra.can).toBe(2);
    expect(sonra.nesneler).toHaveLength(0);
  });

  it("yeşile çarpınca skor 10 artar ve yeşil kaybolur", () => {
    const sonra = oyunuIlerlet(durum({ nesneler: [kureyeDegen("yesil")] }), hicKimse, 0, hepKirmizi);
    expect(sonra.skor).toBe(10);
    expect(sonra.nesneler).toHaveLength(0);
  });

  it("kaçan yeşil skordan 10 düşer, kaçan kırmızı hiçbir şey değiştirmez", () => {
    const kacmis: Nesne[] = [
      { tur: "yesil", serit: 0, y: EKRAN_YUKSEKLIGI + 1 },
      { tur: "kirmizi", serit: 2, y: EKRAN_YUKSEKLIGI + 1 },
    ];
    const sonra = oyunuIlerlet(durum({ skor: 30, nesneler: kacmis }), hicKimse, 0, hepKirmizi);
    expect(sonra.skor).toBe(20);
    expect(sonra.can).toBe(3);
    expect(sonra.nesneler).toHaveLength(0);
  });

  it("sıra aralığı dolunca ekranın üstüne yeni bir sıra eklenir", () => {
    const sonra = oyunuIlerlet(durum(), hicKimse, SIRA_ARALIGI, hepKirmizi);
    expect(sonra.nesneler).toEqual([
      { tur: "kirmizi", serit: 0, y: -NESNE_BOYUTU },
      { tur: "kirmizi", serit: 1, y: -NESNE_BOYUTU },
    ]);
  });

  it("son can ile kırmızıya çarpınca oyun biter", () => {
    const sonra = oyunuIlerlet(durum({ can: 1, nesneler: [kureyeDegen("kirmizi")] }), hicKimse, 0, hepKirmizi);
    expect(sonra.bitti).toBe(true);
  });

  it("oyun bittikten sonra durum artık değişmez", () => {
    const bitmis = durum({ can: 0, bitti: true });
    expect(oyunuIlerlet(bitmis, { yon: 1 }, 1, hepKirmizi)).toBe(bitmis);
  });
});
