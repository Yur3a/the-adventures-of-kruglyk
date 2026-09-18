import Phaser from 'phaser';
import { FONT_FAMILY, nextNumber, TEXT_RESOLUTION } from '../utils/constants';

export class Kruglyk extends Phaser.GameObjects.Container {
  value = 0;
  private readonly visual: Phaser.GameObjects.Container;
  private readonly shell: Phaser.GameObjects.Graphics;
  private readonly numberLabel: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    this.add(scene.add.ellipse(0, 49, 77, 14, 0x244d42, 0.35));
    this.visual = scene.add.container(0, 0);
    this.add(this.visual);

    this.shell = scene.add.graphics();
    this.shell.fillStyle(0x5cabfc, 0.08).fillCircle(0, 0, 61);
    this.shell.fillStyle(0x5cabfc, 0.1).fillCircle(0, 0, 52);
    this.shell.fillStyle(0x2566c9).fillCircle(0, 0, 43);
    this.shell.fillStyle(0x448cf0).fillCircle(-2, -4, 40);
    this.shell.fillStyle(0x60a9ff).fillEllipse(-13, -22, 35, 23);
    this.shell.lineStyle(2, 0x98d5ff, 0.75).beginPath().arc(0, 0, 40, 3.65, 5.55).strokePath();
    this.shell.fillStyle(0xa9ddff, 0.6).fillEllipse(-22, -25, 12, 7);
    this.visual.add(this.shell);

    const face = scene.add.graphics();
    face.fillStyle(0xffffff).fillEllipse(-12, -17, 13, 17).fillEllipse(12, -17, 13, 17);
    face.fillStyle(0x173e66).fillEllipse(-9, -16, 5, 9).fillEllipse(15, -16, 5, 9);
    face.fillStyle(0xffffff).fillCircle(-8, -18, 1.5).fillCircle(16, -18, 1.5);
    face.fillStyle(0xb0d9ff, 0.7).fillEllipse(-27, -1, 9, 5).fillEllipse(27, -1, 9, 5);
    face.lineStyle(2, 0xd1eaff).beginPath().arc(0, 29, 5, 0.15, Math.PI - 0.15).strokePath();
    this.visual.add(face);
    this.numberLabel = scene.add.text(0, 10, '0', { resolution: TEXT_RESOLUTION, fontFamily: FONT_FAMILY, fontSize: '33px', fontStyle: 'bold', color: '#ffffff', stroke: '#3178d7', strokeThickness: 1 }).setOrigin(0.5);
    this.visual.add(this.numberLabel);
    scene.tweens.add({ targets: this.visual, y: -6, duration: 1250, ease: 'Sine.InOut', yoyo: true, repeat: -1 });
  }

  increment(): number {
    this.value = nextNumber(this.value);
    this.numberLabel.setText(String(this.value));
    this.scene.tweens.killTweensOf(this.numberLabel);
    this.numberLabel.setScale(1.16);
    this.scene.tweens.add({ targets: this.numberLabel, scale: 1, duration: 160, ease: 'Back.Out' });
    return this.value;
  }

  attack(): void {
    this.scene.tweens.add({ targets: this.shell, angle: this.shell.angle + 360, duration: 350, ease: 'Cubic.Out' });
    this.scene.tweens.add({ targets: this.visual, scaleX: 0.91, scaleY: 1.07, duration: 95, yoyo: true });
  }

  recoil(): void {
    this.scene.tweens.add({ targets: this.visual, x: -12, duration: 55, yoyo: true, repeat: 2, ease: 'Sine.InOut', onComplete: () => this.visual.setX(0) });
  }
}
