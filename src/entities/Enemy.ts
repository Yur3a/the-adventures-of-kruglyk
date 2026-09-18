import Phaser from 'phaser';
import type { MathProblem } from '../systems/MathProblemGenerator';
import { FONT_FAMILY } from '../utils/constants';

export class Enemy extends Phaser.GameObjects.Container {
  readonly problem: MathProblem;
  private readonly character: Phaser.GameObjects.Container;
  private readonly equation: Phaser.GameObjects.Container;
  private readonly reaction: Phaser.GameObjects.Ellipse;

  constructor(scene: Phaser.Scene, x: number, y: number, problem: MathProblem) {
    super(scene, x, y);
    this.problem = problem;
    scene.add.existing(this);
    this.add(scene.add.ellipse(0, 51, 77, 14, 0x244d42, 0.35));
    this.character = scene.add.container(0, 0);
    this.add(this.character);
    const body = scene.add.graphics();
    body.fillStyle(0x4c386c).fillTriangle(-32, -20, -32, -55, -8, -34).fillTriangle(17, -32, 41, -52, 34, -9);
    body.fillStyle(0x71518d).fillTriangle(-28, -27, -28, -43, -16, -32).fillTriangle(22, -31, 35, -43, 31, -20);
    body.fillStyle(0x533c72).fillRoundedRect(-43, -35, 86, 81, { tl: 39, tr: 39, bl: 26, br: 26 });
    body.fillStyle(0x735493).fillEllipse(-2, -7, 78, 71);
    body.fillStyle(0x8b6aa6, 0.55).fillEllipse(-13, -22, 35, 16);
    body.fillStyle(0x533c72).fillEllipse(-25, 42, 28, 15).fillEllipse(25, 42, 28, 15);
    body.fillStyle(0xf2eacf).fillEllipse(-16, -5, 19, 20).fillEllipse(16, -5, 19, 20);
    body.fillStyle(0x362f50).fillEllipse(-19, -4, 7, 11).fillEllipse(13, -4, 7, 11);
    body.lineStyle(5, 0x45335d).lineBetween(-28, -19, -7, -13).lineBetween(8, -13, 29, -19);
    body.lineStyle(2.5, 0x40324f).beginPath().arc(0, 23, 8, Math.PI + 0.2, Math.PI * 2 - 0.2).strokePath();
    body.fillStyle(0xa887ad, 0.6).fillEllipse(-30, 12, 10, 5).fillEllipse(30, 12, 10, 5);
    this.character.add(body);
    this.reaction = scene.add.ellipse(0, 0, 91, 91, 0xf6787c, 0).setStrokeStyle(3, 0xf98b8d, 0);
    this.character.add(this.reaction);

    this.equation = scene.add.container(0, -109);
    const card = scene.add.graphics();
    card.fillStyle(0x183c39, 0.22).fillRoundedRect(-82, -37, 164, 78, 17);
    card.fillStyle(0xf3eed7).fillRoundedRect(-82, -42, 164, 77, 17).fillTriangle(-7, 34, 7, 34, 0, 43);
    card.lineStyle(1, 0xffffff, 0.65).strokeRoundedRect(-79, -39, 158, 70, 14);
    const caption = scene.add.text(0, -23, 'РОЗВ’ЯЖИ ПРИКЛАД', { fontFamily: FONT_FAMILY, fontSize: '9px', fontStyle: 'bold', color: '#8f947b', letterSpacing: 1.2 }).setOrigin(0.5);
    const example = scene.add.text(0, 6, problem.display, { fontFamily: FONT_FAMILY, fontSize: '34px', fontStyle: 'bold', color: '#3e514a' }).setOrigin(0.5);
    this.equation.add([card, caption, example]);
    this.add(this.equation);
    scene.tweens.add({ targets: this.character, y: -5, angle: 2, duration: 1450, ease: 'Sine.InOut', yoyo: true, repeat: -1 });
    this.setAlpha(0);
    scene.tweens.add({ targets: this, alpha: 1, duration: 300 });
  }

  reject(): void {
    this.reaction.setFillStyle(0xf6787c, 0.35).setStrokeStyle(3, 0xf98b8d, 0.9);
    this.scene.tweens.add({ targets: this.reaction, alpha: 0, duration: 420, onComplete: () => this.reaction.setFillStyle(0xf6787c, 0).setStrokeStyle(0).setAlpha(1) });
    this.scene.tweens.add({ targets: this.equation, x: 5, duration: 45, repeat: 3, yoyo: true, onComplete: () => this.equation.setX(0) });
  }

  defeat(onComplete: () => void): void {
    this.scene.tweens.killTweensOf(this.character);
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const particle = this.scene.add.circle(this.x, this.y, 3 + i % 4, i % 2 ? 0xc5b5ed : 0xf6e9aa);
      this.scene.tweens.add({ targets: particle, x: this.x + Math.cos(angle) * (65 + i % 3 * 17), y: this.y + Math.sin(angle) * 60, alpha: 0, scale: 0.2, duration: 500 + i * 15, onComplete: () => particle.destroy() });
    }
    this.scene.tweens.add({ targets: this, alpha: 0, scale: 0.45, y: this.y - 18, duration: 320, ease: 'Back.In', onComplete: () => { this.destroy(); onComplete(); } });
  }
}
