// Tarayıcı tarafı: klavye, oyun döngüsü ve çizim. Oyun kuralı içermez.

import {
  EKRAN_GENISLIGI,
  EKRAN_YUKSEKLIGI,
  KURE_BOYUTU,
  KURE_Y,
  NESNE_BOYUTU,
  SERIT_GENISLIGI,
  SERIT_SAYISI,
} from "./game/config";
import { seritMerkezi } from "./game/rules";
import { baslangicDurumu, oyunuIlerlet, type Girdi, type OyunDurumu } from "./game/state";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const RENK = {
  arkaPlan: "#11111b",
  seritCizgisi: "#313244",
  kure: "#89b4fa",
  kirmizi: "#f38ba8",
  yesil: "#a6e3a1",
  yazi: "#cdd6f4",
};

let durum: OyunDurumu = baslangicDurumu();
let bekleyenYon: Girdi["yon"] = 0;

window.addEventListener("keydown", (e) => {
  if (e.repeat) return; // basılı tutmak tek şerit sayılır
  if (e.code === "KeyA") bekleyenYon = -1;
  if (e.code === "KeyD") bekleyenYon = 1;
  if (e.code === "Space") {
    e.preventDefault(); // sayfa kaymasın
    if (durum.bitti) durum = baslangicDurumu();
  }
});

function oyunBittiEkrani(skor: number): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, EKRAN_GENISLIGI, EKRAN_YUKSEKLIGI);

  const ortaX = EKRAN_GENISLIGI / 2;
  const ortaY = EKRAN_YUKSEKLIGI / 2;
  ctx.fillStyle = RENK.yazi;
  ctx.textAlign = "center";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("OYUN BİTTİ", ortaX, ortaY - 40);
  ctx.font = "28px sans-serif";
  ctx.fillText(`Skor: ${skor}`, ortaX, ortaY + 10);
  ctx.font = "18px sans-serif";
  ctx.fillText("Yeniden başlamak için SPACE", ortaX, ortaY + 60);
}

function ciz(d: OyunDurumu): void {
  ctx.fillStyle = RENK.arkaPlan;
  ctx.fillRect(0, 0, EKRAN_GENISLIGI, EKRAN_YUKSEKLIGI);

  ctx.strokeStyle = RENK.seritCizgisi;
  for (let i = 1; i < SERIT_SAYISI; i++) {
    ctx.beginPath();
    ctx.moveTo(i * SERIT_GENISLIGI, 0);
    ctx.lineTo(i * SERIT_GENISLIGI, EKRAN_YUKSEKLIGI);
    ctx.stroke();
  }

  for (const n of d.nesneler) {
    const x = seritMerkezi(n.serit);
    if (n.tur === "kirmizi") {
      ctx.fillStyle = RENK.kirmizi;
      ctx.fillRect(x - NESNE_BOYUTU / 2, n.y, NESNE_BOYUTU, NESNE_BOYUTU);
    } else {
      ctx.fillStyle = RENK.yesil;
      ctx.beginPath();
      ctx.arc(x, n.y + NESNE_BOYUTU / 2, NESNE_BOYUTU / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = RENK.kure;
  ctx.beginPath();
  ctx.arc(d.kureX, KURE_Y + KURE_BOYUTU / 2, KURE_BOYUTU / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = RENK.yazi;
  ctx.font = "20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Skor: ${d.skor}`, 12, 30);
  ctx.textAlign = "right";
  ctx.fillText(`Can: ${"♥".repeat(Math.max(0, d.can))}`, EKRAN_GENISLIGI - 12, 30);

  if (d.bitti) oyunBittiEkrani(d.skor);
}

let oncekiZaman = performance.now();

function kare(simdi: number): void {
  // Sekme arka plandayken dt çok büyüyebilir; nesneler ışınlanmasın diye en fazla 0,1 s.
  const dt = Math.min((simdi - oncekiZaman) / 1000, 0.1);
  oncekiZaman = simdi;

  durum = oyunuIlerlet(durum, { yon: bekleyenYon }, dt, Math.random);
  bekleyenYon = 0;

  ciz(durum);
  requestAnimationFrame(kare);
}

requestAnimationFrame(kare);
