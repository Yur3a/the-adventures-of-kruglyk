import Phaser from 'phaser';
import type { MathProblem } from '../systems/MathProblemGenerator';
import { FONT_FAMILY, TEXT_RESOLUTION } from '../utils/constants';
import { drawEnemy } from './drawEnemy';
import type { EnemyVariant } from './enemyVariants';

export class Enemy extends Phaser.GameObjects.Container {
  readonly problem: MathProblem;
  readonly variant: EnemyVariant;
  private readonly character: Phaser.GameObjects.Container;
  private readonly equation: Phaser.GameObjects.Container;
  private readonly reaction: Phaser.GameObjects.Ellipse;

  constructor(scene: Phaser.Scene, x: number, y: number, problem: MathProblem, variant: EnemyVariant) {
    super(scene, x, y);
    this.problem = problem;
    this.variant = variant;
    scene.add.existing(this);
    this.add(scene.add.ellipse(0, 51, 77, 14, 0x244d42, 0.35));
    this.character = scene.add.container(0, 0);
    this.add(this.character);
    const body = scene.add.graphics();
    drawEnemy(body, variant);
    this.character.add(body);
    this.reaction = scene.add.ellipse(0, 0, 116, 114, 0xf6787c, 0).setStrokeStyle(3, 0xf98b8d, 0);
    this.character.add(this.reaction);

    this.equation = scene.add.container(0, -116);
    const card = scene.add.graphics();
    card.fillStyle(0x183c39, 0.22).fillRoundedRect(-82, -37, 164, 78, 17);
    card.fillStyle(0xf3eed7).fillRoundedRect(-82, -42, 164, 77, 17).fillTriangle(-7, 34, 7, 34, 0, 43);
    card.lineStyle(1, 0xffffff, 0.65).strokeRoundedRect(-79, -39, 158, 70, 14);
    const caption = scene.add.text(0, -25, 'РОЗВ’ЯЖИ ПРИКЛАД', { resolution: TEXT_RESOLUTION, fontFamily: FONT_FAMILY, fontSize: '11px', fontStyle: 'bold', color: '#655748', letterSpacing: 1.2 }).setOrigin(0.5);
    const example = scene.add.text(0, 9, problem.display, { resolution: TEXT_RESOLUTION, fontFamily: FONT_FAMILY, fontSize: '38px', fontStyle: 'bold', color: '#202c38' }).setOrigin(0.5);
    this.equation.add([card, caption, example]);
    this.add(this.equation);
    scene.tweens.add({ targets: this.character, y: -variant.lift, angle: variant.sway, duration: variant.duration, ease: 'Sine.InOut', yoyo: true, repeat: -1 });
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
      const particle = this.scene.add.circle(this.x, this.y, 3 + i % 4, i % 2 ? this.variant.accent : 0xf6e9aa);
      this.scene.tweens.add({ targets: particle, x: this.x + Math.cos(angle) * (65 + i % 3 * 17), y: this.y + Math.sin(angle) * 60, alpha: 0, scale: 0.2, duration: 500 + i * 15, onComplete: () => particle.destroy() });
    }
    this.scene.tweens.add({ targets: this, alpha: 0, scale: 0.45, y: this.y - 18, duration: 320, ease: 'Back.In', onComplete: () => { this.destroy(); onComplete(); } });
  }
}
