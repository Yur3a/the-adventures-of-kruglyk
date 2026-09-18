import type Phaser from 'phaser';
import type { EnemyVariant } from './enemyVariants';

type Graphics = Phaser.GameObjects.Graphics;
const INK = 0x302d45;
const EYE = 0xfff3d8;

function eyes(g: Graphics, y: number, spacing = 15, width = 18, height = 21): void {
  g.fillStyle(EYE).fillEllipse(-spacing, y, width, height).fillEllipse(spacing, y, width, height);
  g.fillStyle(INK).fillEllipse(-spacing - 3, y + 1, 6, height * 0.55).fillEllipse(spacing - 3, y + 1, 6, height * 0.55);
}

function brows(g: Graphics, y: number, spacing = 15): void {
  g.lineStyle(4, INK).lineBetween(-spacing - 9, y - 3, -spacing + 8, y + 2).lineBetween(spacing - 8, y + 2, spacing + 9, y - 3);
}

function frown(g: Graphics, y: number, radius = 8): void {
  g.lineStyle(2.5, INK).beginPath().arc(0, y, radius, Math.PI + 0.2, Math.PI * 2 - 0.2).strokePath();
}

function feet(g: Graphics, color: number, spacing = 24): void {
  g.fillStyle(color).fillEllipse(-spacing, 42, 27, 14).fillEllipse(spacing, 42, 27, 14);
}

function drawGrump(g: Graphics, v: EnemyVariant): void {
  g.fillStyle(v.shade).fillTriangle(-32, -20, -32, -55, -8, -34).fillTriangle(17, -32, 41, -52, 34, -9);
  g.fillStyle(v.accent, 0.5).fillTriangle(-28, -27, -28, -43, -16, -32).fillTriangle(22, -31, 35, -43, 31, -20);
  g.fillStyle(v.shade).fillRoundedRect(-43, -35, 86, 81, { tl: 39, tr: 39, bl: 26, br: 26 });
  g.fillStyle(v.body).fillEllipse(-2, -7, 78, 71);
  g.fillStyle(v.accent, 0.3).fillEllipse(-13, -22, 35, 16);
  feet(g, v.shade);
  eyes(g, -5, 16, 19, 20);
  brows(g, -17, 18);
  frown(g, 23);
  g.fillStyle(v.accent, 0.6).fillEllipse(-30, 12, 10, 5).fillEllipse(30, 12, 10, 5);
}

function drawEmber(g: Graphics, v: EnemyVariant): void {
  g.fillStyle(v.shade).fillTriangle(-32, 17, -54, 5, -37, 36).fillTriangle(32, 17, 52, 0, 36, 36);
  g.fillStyle(v.body).fillTriangle(-35, -15, -30, -49, -5, -23).fillTriangle(-16, -24, 6, -56, 27, -11).fillTriangle(14, -20, 35, -40, 35, 6);
  g.fillStyle(v.shade).fillEllipse(0, 6, 84, 82);
  g.fillStyle(v.body).fillEllipse(-2, 1, 78, 74);
  g.fillStyle(v.accent, 0.6).fillEllipse(-4, 21, 48, 34).fillTriangle(-12, -30, 4, -47, 7, -21);
  feet(g, v.shade, 22);
  eyes(g, -4, 15, 19, 19);
  brows(g, -17);
  g.lineStyle(3, INK).lineBetween(-10, 21, 10, 18);
  g.fillStyle(EYE).fillTriangle(2, 20, 9, 19, 6, 28);
}

function drawSlime(g: Graphics, v: EnemyVariant): void {
  g.fillStyle(v.shade).fillEllipse(0, 30, 105, 34);
  g.fillStyle(v.body).fillCircle(7, -34, 20).fillEllipse(-3, 2, 79, 79);
  g.fillCircle(-36, 26, 16).fillCircle(35, 26, 18).fillEllipse(0, 33, 98, 23);
  g.fillStyle(v.accent, 0.6).fillEllipse(-23, -19, 10, 19).fillCircle(2, -43, 5).fillCircle(-12, -33, 3);
  g.fillStyle(v.shade, 0.3).fillEllipse(16, 34, 24, 6).fillEllipse(-20, 34, 14, 5);
  eyes(g, -5, 16, 21, 25);
  g.lineStyle(3, INK).lineBetween(-28, -20, -11, -17).lineBetween(7, -20, 24, -25);
  g.lineStyle(3, INK).beginPath().moveTo(-10, 23).lineTo(0, 20).lineTo(10, 22).strokePath();
  g.fillStyle(EYE).fillRoundedRect(-6, 22, 7, 7, 2);
}

function drawSpike(g: Graphics, v: EnemyVariant): void {
  for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI / 6;
    g.fillStyle(i % 2 ? v.shade : v.body).fillTriangle(
      Math.cos(angle - 0.22) * 32, Math.sin(angle - 0.22) * 32,
      Math.cos(angle) * 54, Math.sin(angle) * 54,
      Math.cos(angle + 0.22) * 32, Math.sin(angle + 0.22) * 32,
    );
  }
  g.fillStyle(v.shade).fillCircle(0, 0, 40);
  g.fillStyle(v.body).fillCircle(-2, -3, 37);
  g.fillStyle(v.accent, 0.45).fillTriangle(-21, -25, -13, -38, -4, -24).fillTriangle(-3, -26, 6, -38, 15, -23);
  feet(g, v.shade, 20);
  eyes(g, -5, 14, 17, 20);
  brows(g, -18, 15);
  g.fillStyle(INK).fillTriangle(-5, 9, 5, 9, 0, 14);
  g.lineStyle(2.5, INK).beginPath().moveTo(-10, 23).lineTo(-4, 19).lineTo(2, 23).lineTo(9, 19).strokePath();
  g.fillStyle(v.accent, 0.7).fillEllipse(-27, 10, 8, 5).fillEllipse(27, 10, 8, 5);
}

function drawCloud(g: Graphics, v: EnemyVariant): void {
  g.fillStyle(v.shade).fillCircle(-32, 7, 22).fillCircle(33, 7, 22).fillEllipse(0, 17, 83, 62);
  g.fillStyle(v.body).fillCircle(-25, -13, 24).fillCircle(1, -29, 25).fillCircle(27, -11, 25).fillEllipse(0, 10, 83, 62);
  g.fillTriangle(-31, 27, -24, 49, -9, 30).fillTriangle(-11, 31, 2, 48, 14, 29).fillTriangle(13, 29, 30, 46, 35, 20);
  g.fillStyle(v.accent, 0.4).fillEllipse(-9, -35, 25, 11).fillCircle(-33, -16, 7);
  eyes(g, -1, 15, 19, 22);
  g.fillStyle(v.body).fillRect(-26, -15, 23, 10).fillRect(4, -15, 23, 10);
  g.lineStyle(3, INK).lineBetween(-24, -6, -7, -3).lineBetween(7, -3, 24, -6);
  g.fillStyle(INK).fillEllipse(0, 23, 10, 13);
  g.fillStyle(v.accent, 0.65).fillEllipse(-24, 17, 10, 5).fillEllipse(24, 17, 10, 5);
}

function drawCrystal(g: Graphics, v: EnemyVariant): void {
  g.fillStyle(v.shade).fillTriangle(-32, 14, -53, -9, -44, 34).fillTriangle(31, 14, 51, -13, 42, 34);
  g.fillStyle(v.body).fillPoints([{ x: 0, y: -55 }, { x: 34, y: -22 }, { x: 42, y: 13 }, { x: 22, y: 44 }, { x: -22, y: 44 }, { x: -42, y: 13 }, { x: -34, y: -22 }], true);
  g.fillStyle(v.accent, 0.7).fillTriangle(0, -55, -34, -22, -9, -9);
  g.fillStyle(v.shade, 0.65).fillTriangle(0, -55, 34, -22, 13, -8).fillTriangle(13, -8, 42, 13, 22, 44);
  g.fillStyle(v.accent, 0.25).fillTriangle(-9, -9, 13, -8, 0, 44).fillTriangle(-42, 13, -9, -9, -22, 44);
  g.lineStyle(1, v.accent, 0.65).beginPath().moveTo(-34, -22).lineTo(0, -55).lineTo(34, -22).strokePath();
  eyes(g, -1, 15, 18, 17);
  brows(g, -14);
  g.lineStyle(2.5, INK).lineBetween(-9, 22, 10, 19);
  g.fillStyle(EYE).fillTriangle(-5, 21, 1, 20, -2, 28);
  g.fillStyle(v.accent).fillTriangle(-24, -27, -21, -33, -18, -27).fillTriangle(-24, -27, -21, -21, -18, -27);
}

function drawMushroom(g: Graphics, v: EnemyVariant): void {
  g.fillStyle(0xa78164).fillRoundedRect(-29, -20, 58, 65, 20);
  g.fillStyle(v.accent).fillRoundedRect(-27, -20, 52, 61, 18);
  feet(g, 0xb99471, 19);
  g.fillStyle(v.shade).fillEllipse(0, -20, 108, 30);
  g.fillStyle(v.body).fillEllipse(0, -32, 106, 47);
  g.fillStyle(v.accent).fillEllipse(-26, -36, 20, 12).fillCircle(3, -46, 7).fillEllipse(26, -31, 17, 12);
  g.fillStyle(0xf7b6a0, 0.5).fillEllipse(-21, -46, 19, 5);
  eyes(g, 5, 13, 17, 20);
  brows(g, -7, 13);
  frown(g, 31, 7);
  g.fillStyle(v.body, 0.4).fillEllipse(-22, 20, 7, 5).fillEllipse(22, 20, 7, 5);
}

function drawCyclops(g: Graphics, v: EnemyVariant): void {
  g.fillStyle(v.accent).fillTriangle(-31, -24, -41, -51, -9, -32).fillTriangle(11, -32, 41, -51, 31, -24);
  g.fillStyle(v.shade).fillRoundedRect(-39, -36, 78, 81, 24);
  g.fillStyle(v.body).fillRoundedRect(-36, -36, 70, 75, 23);
  g.fillStyle(v.accent, 0.5).fillEllipse(-17, -27, 25, 11);
  feet(g, v.shade, 22);
  g.fillStyle(v.shade).fillCircle(0, -7, 23);
  g.fillStyle(EYE).fillCircle(0, -8, 19);
  g.fillStyle(INK).fillEllipse(-4, -7, 11, 20);
  g.fillStyle(0xffffff).fillCircle(-6, -12, 3);
  g.lineStyle(5, INK).lineBetween(-20, -28, 19, -23);
  g.fillStyle(INK).fillRoundedRect(-14, 22, 28, 15, 6);
  g.fillStyle(EYE).fillRoundedRect(-6, 22, 11, 10, 2);
  g.fillStyle(v.accent, 0.5).fillEllipse(-26, 15, 9, 5).fillEllipse(26, 15, 9, 5);
}

export function drawEnemy(g: Graphics, variant: EnemyVariant): void {
  switch (variant.id) {
    case 'grump': drawGrump(g, variant); break;
    case 'ember': drawEmber(g, variant); break;
    case 'slime': drawSlime(g, variant); break;
    case 'spike': drawSpike(g, variant); break;
    case 'cloud': drawCloud(g, variant); break;
    case 'crystal': drawCrystal(g, variant); break;
    case 'mushroom': drawMushroom(g, variant); break;
    case 'cyclops': drawCyclops(g, variant); break;
  }
}
