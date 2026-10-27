import { describe, expect, it } from "vitest";
import { kutularCarpisiyorMu, type Kutu } from "../src/game/rules";

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
