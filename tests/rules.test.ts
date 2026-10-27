import { describe, expect, it } from "vitest";
import {
  hedefeKaydir,
  ilerlet,
  kirmiziyaCarpti,
  kutularCarpisiyorMu,
  oyunBittiMi,
  seritDegistir,
  seritMerkezi,
  yesilKacti,
  yesilYakalandi,
  type Kutu,
} from "../src/game/rules";

const kutu = (x: number, y: number, w = 10, h = 10): Kutu => ({ x, y, w, h });

describe("kutularCarpisiyorMu", () => {
  it("üst üste binen kutular çarpışır", () => {
    expect(kutularCarpisiyorMu(kutu(0, 0), kutu(5, 5))).toBe(true);
  });

  it("yatayda ayrık kutular çarpışmaz", () => {
    expect(kutularCarpisiyorMu(kutu(0, 0), kutu(20, 0))).toBe(false);
  });

  it("dikeyde ayrık kutular çarpışmaz", () => {
    expect(kutularCarpisiyorMu(kutu(0, 0), kutu(0, 20))).toBe(false);
  });

  it("yatayda kenar teması çarpışma sayılır", () => {
    expect(kutularCarpisiyorMu(kutu(0, 0), kutu(10, 0))).toBe(true);
  });

  it("dikeyde kenar teması çarpışma sayılır", () => {
    expect(kutularCarpisiyorMu(kutu(0, 0), kutu(0, 10))).toBe(true);
  });

  it("aralarında 1 piksel boşluk varsa çarpışmaz", () => {
    expect(kutularCarpisiyorMu(kutu(0, 0), kutu(11, 0))).toBe(false);
  });
});

describe("skor kuralları", () => {
  it("yeşil yakalanınca skor 10 artar", () => {
    expect(yesilYakalandi(0)).toBe(10);
  });

  it("yeşil kaçınca skor 10 azalır", () => {
    expect(yesilKacti(20)).toBe(10);
  });

  it("skor tam 10 iken yeşil kaçarsa skor 0 olur", () => {
    expect(yesilKacti(10)).toBe(0);
  });

  it("skor 0 iken yeşil kaçarsa skor 0'da kalır", () => {
    expect(yesilKacti(0)).toBe(0);
  });

  it("ceza skoru 0'ın altına düşüremez", () => {
    expect(yesilKacti(5)).toBe(0);
  });
});

describe("delta time ile hareket", () => {
  it("200 px/s hızla yarım saniyede 100 piksel gidilir", () => {
    expect(ilerlet(0, 200, 0.5)).toBe(100);
  });

  it("60 FPS ve 30 FPS'te 1 saniye sonunda aynı yere varılır", () => {
    let ali = 0;
    for (let i = 0; i < 60; i++) ali = ilerlet(ali, 200, 1 / 60);
    let ayse = 0;
    for (let i = 0; i < 30; i++) ayse = ilerlet(ayse, 200, 1 / 30);
    expect(ali).toBeCloseTo(200);
    expect(ayse).toBeCloseTo(200);
  });

  it("küre hedefe doğru hız × dt kadar kayar", () => {
    expect(hedefeKaydir(80, 240, 320, 0.1)).toBe(112);
    expect(hedefeKaydir(240, 80, 320, 0.1)).toBe(208);
  });

  it("küre hedefi geçmez, tam hedefte durur", () => {
    expect(hedefeKaydir(238, 240, 320, 0.1)).toBe(240);
  });
});

describe("şerit değiştirme", () => {
  it("ortadaki şeritten sağa ve sola geçilir", () => {
    expect(seritDegistir(1, 1)).toBe(2);
    expect(seritDegistir(1, -1)).toBe(0);
  });

  it("en kenardaki şeritten öteye geçilmez (duvar)", () => {
    expect(seritDegistir(2, 1)).toBe(2);
    expect(seritDegistir(0, -1)).toBe(0);
  });

  it("şerit merkezleri ekranı eşit böler", () => {
    expect(seritMerkezi(0)).toBe(80);
    expect(seritMerkezi(1)).toBe(240);
    expect(seritMerkezi(2)).toBe(400);
  });
});

describe("can ve oyun-bitti kuralları", () => {
  it("kırmızıya çarpınca 1 can gider", () => {
    expect(kirmiziyaCarpti(3)).toBe(2);
  });

  it("son can ile kırmızıya çarpınca can 0 olur", () => {
    expect(kirmiziyaCarpti(1)).toBe(0);
  });

  it("can kaldıkça oyun bitmez", () => {
    expect(oyunBittiMi(3)).toBe(false);
    expect(oyunBittiMi(2)).toBe(false);
    expect(oyunBittiMi(1)).toBe(false);
  });

  it("can 0 olunca oyun biter", () => {
    expect(oyunBittiMi(0)).toBe(true);
  });
});
