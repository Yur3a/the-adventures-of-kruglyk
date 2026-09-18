import Phaser from 'phaser';

function hill(graphics: Phaser.GameObjects.Graphics, color: number, points: number[]): void {
  const curve = new Phaser.Curves.Spline(points);
  const outline = curve.getPoints(60);
  outline.push(new Phaser.Math.Vector2(1000, 550), new Phaser.Math.Vector2(-40, 550));
  graphics.fillStyle(color).fillPoints(outline, true);
}

function leaf(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, angle = 0): void {
  graphics.save().translateCanvas(x, y).rotateCanvas(angle);
  graphics.fillStyle(color).fillEllipse(0, 0, size * 0.5, size);
  graphics.restore();
}

function plant(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number): void {
  graphics.lineStyle(2, color).lineBetween(x, y, x, y - size);
  for (let i = 1; i <= 3; i++) {
    const offset = i * size / 4;
    leaf(graphics, x - size * 0.11, y - offset, size * 0.38, color, -0.8);
    leaf(graphics, x + size * 0.12, y - offset - 7, size * 0.35, color, 0.8);
  }
}

export function drawLandscape(scene: Phaser.Scene): void {
  const sky = scene.add.graphics();
  sky.fillStyle(0x193e43).fillRect(0, 0, 960, 540);
  sky.fillStyle(0x204b4c).fillEllipse(490, 203, 900, 385);
  sky.fillStyle(0x275554).fillEllipse(505, 255, 850, 310);
  sky.fillStyle(0x2e5e58).fillEllipse(516, 296, 770, 264);

  // Deterministic scenery keeps random decoration separate from the math generator.
  const random = new Phaser.Math.RandomDataGenerator(['kruglyk-glade']);
  for (let i = 0; i < 48; i++) {
    const x = random.between(25, 935);
    const y = random.between(25, 295);
    sky.fillStyle(0xd9eab5, random.realInRange(0.12, 0.5)).fillCircle(x, y, random.realInRange(0.7, 1.7));
  }

  sky.fillStyle(0xd5dfaa, 0.035).fillCircle(785, 113, 77);
  sky.fillStyle(0xd5dfaa, 0.06).fillCircle(785, 113, 53);
  sky.fillStyle(0xe3e7b9).fillCircle(785, 113, 29);
  sky.fillStyle(0x264e4d).fillCircle(797, 103, 27);

  const distant = scene.add.graphics();
  hill(distant, 0x36685e, [-40, 313, 95, 239, 233, 261, 351, 227, 478, 282, 608, 229, 787, 259, 1000, 219]);
  distant.fillStyle(0x2d5d56);
  for (const [x, y, w, h] of [[75, 215, 33, 116], [130, 239, 29, 95], [858, 198, 34, 144], [893, 228, 34, 108]]) {
    distant.fillRoundedRect(x, y, w, h, w / 2);
  }
  hill(distant, 0x437b67, [-40, 345, 130, 306, 311, 319, 465, 299, 662, 319, 811, 291, 1000, 325]);
  hill(distant, 0x538a6d, [-40, 374, 171, 349, 344, 365, 477, 337, 654, 360, 787, 344, 1000, 364]);
  hill(distant, 0x679c76, [-40, 389, 161, 374, 338, 394, 470, 360, 668, 390, 810, 372, 1000, 396]);

  const path = scene.add.graphics();
  path.fillStyle(0x83a57c, 0.75).fillPoints([
    { x: 471, y: 345 }, { x: 512, y: 345 }, { x: 558, y: 373 },
    { x: 497, y: 405 }, { x: 580, y: 445 }, { x: 662, y: 540 },
    { x: 313, y: 540 }, { x: 401, y: 444 }, { x: 436, y: 406 }, { x: 505, y: 373 },
  ], true);
  path.fillStyle(0xb7c294, 0.28);
  for (const [x, y, w] of [[493, 360, 14], [512, 374, 22], [478, 392, 28], [461, 414, 41], [486, 444, 58]]) {
    path.fillEllipse(x, y, w, w * 0.25);
  }

  const trees = scene.add.graphics();
  trees.fillStyle(0x173e40).fillPoints([{ x: 7, y: 0 }, { x: 53, y: 0 }, { x: 72, y: 142 }, { x: 54, y: 320 }, { x: 31, y: 333 }, { x: 41, y: 164 }], true);
  trees.lineStyle(16, 0x173e40).lineBetween(51, 163, 97, 99).lineBetween(47, 108, 11, 63);
  trees.fillStyle(0x153b3e);
  for (const [x, y, r] of [[0, 44, 80], [54, 17, 77], [106, 5, 72], [10, 133, 48], [962, 43, 80], [916, 3, 70], [966, 142, 59]]) {
    trees.fillCircle(x, y, r);
  }
  trees.fillStyle(0x214b45).fillCircle(-12, 248, 54).fillCircle(21, 285, 42).fillCircle(964, 279, 67);
  plant(trees, 103, 358, 77, 0x366752);
  plant(trees, 856, 351, 57, 0x2d6655);

  const grass = scene.add.graphics();
  grass.fillStyle(0x396b54, 0.4).fillEllipse(224, 372, 183, 30).fillEllipse(738, 369, 171, 28);
  grass.fillStyle(0x91b17b, 0.6).fillEllipse(224, 365, 176, 20).fillEllipse(738, 362, 165, 18);
  for (let i = 0; i < 65; i++) {
    const x = random.between(25, 935);
    const y = random.between(375, 535);
    if (x > 386 && x < 570) continue;
    grass.lineStyle(1.5, i % 2 ? 0x82aa79 : 0x487a5c, 0.7);
    grass.beginPath().moveTo(x - 4, y - 5).lineTo(x, y).lineTo(x + 2, y - 8).strokePath();
  }

  const foreground = scene.add.graphics();
  hill(foreground, 0x48765c, [-40, 467, 84, 451, 200, 482, 466, 505, 705, 473, 875, 445, 1000, 471]);
  plant(foreground, 31, 510, 108, 0x2e5e4d);
  plant(foreground, 65, 489, 60, 0x56856c);
  plant(foreground, 922, 507, 115, 0x2e5e4d);
  plant(foreground, 885, 493, 76, 0x77987a);
  plant(foreground, 113, 421, 36, 0x789778);
  plant(foreground, 839, 420, 44, 0x688975);

  for (const [x, y, s] of [[83, 391, 1], [109, 400, 0.7], [867, 390, 0.85]]) {
    foreground.fillStyle(0xc4c69f).fillRoundedRect(x - 3 * s, y - 13 * s, 6 * s, 16 * s, 2);
    foreground.fillStyle(0xc5969d).fillEllipse(x, y - 15 * s, 25 * s, 15 * s);
    foreground.fillStyle(0xf3dfc3).fillCircle(x - 5 * s, y - 17 * s, 2 * s).fillCircle(x + 4 * s, y - 19 * s, 2.5 * s);
  }
  for (const [x, y] of [[144, 395], [335, 373], [656, 400], [797, 382], [363, 427]]) {
    foreground.lineStyle(1.5, 0x477859).lineBetween(x, y, x, y - 10);
    foreground.fillStyle(0xd7dbab).fillCircle(x, y - 12, 2.5).fillCircle(x + 3, y - 9, 2.5).fillCircle(x - 3, y - 9, 2.5);
    foreground.fillStyle(0xf6dda1).fillCircle(x, y - 9, 1.7);
  }
  for (let i = 0; i < 10; i++) {
    const dot = scene.add.circle(random.between(150, 850), random.between(120, 360), 2, 0xe4e8a5, 0.45);
    scene.tweens.add({ targets: dot, y: dot.y - 16, alpha: 0.05, duration: random.between(1600, 3000), delay: i * 220, yoyo: true, repeat: -1 });
  }
}
