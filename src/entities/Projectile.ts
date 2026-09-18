import Phaser from 'phaser';
import { FONT_FAMILY, TEXT_RESOLUTION } from '../utils/constants';

export class Projectile extends Phaser.GameObjects.Container {
  readonly answer: number;

  constructor(scene: Phaser.Scene, x: number, y: number, answer: number) {
    super(scene, x, y);
    this.answer = answer;
    scene.add.existing(this);
    const glow = scene.add.graphics();
    glow.fillStyle(0x8bdfff, 0.08).fillCircle(0, 0, 33);
    glow.fillStyle(0x8bdfff, 0.16).fillCircle(0, 0, 24);
    glow.fillStyle(0x86dbff).fillCircle(0, 0, 15);
    glow.lineStyle(2, 0xd6f8ff).strokeCircle(0, 0, 15);
    glow.fillStyle(0xace7ff, 0.5).fillEllipse(-25, 0, 19, 6);
    glow.fillStyle(0xace7ff, 0.2).fillEllipse(-43, 0, 11, 4);
    const number = scene.add.text(0, 0, String(answer), { resolution: TEXT_RESOLUTION, fontFamily: FONT_FAMILY, fontSize: '15px', fontStyle: 'bold', color: '#22577c' }).setOrigin(0.5);
    this.add([glow, number]);
  }

  flyTo(x: number, y: number, onHit: (answer: number) => void): void {
    this.scene.tweens.add({ targets: this, x, y, duration: 470, ease: 'Sine.In', onComplete: () => { onHit(this.answer); this.destroy(); } });
  }
}
