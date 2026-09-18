import Phaser from 'phaser';
import { FONT_FAMILY } from '../utils/constants';

interface HudActions {
  increment: () => void;
  attack: () => void;
  restart: () => void;
}

export class GameHud {
  private readonly scene: Phaser.Scene;
  private readonly scoreLabel: Phaser.GameObjects.Text;
  private readonly message: Phaser.GameObjects.Text;
  private readonly numberButton: Phaser.GameObjects.Container;
  private readonly attackButton: Phaser.GameObjects.Container;
  private messageTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, actions: HudActions) {
    this.scene = scene;
    const chrome = scene.add.graphics();
    chrome.fillStyle(0x0e2c31, 0.57).fillRoundedRect(26, 23, 157, 51, 14);
    chrome.lineStyle(1, 0xa8c3a4, 0.12).strokeRoundedRect(26, 23, 157, 51, 14);
    scene.add.star(52, 48, 5, 5, 10, 0xe9d992).setAngle(-9);
    this.text(72, 49, 'Очки:', 15, '#c7d9c5').setOrigin(0, 0.5);
    this.scoreLabel = this.text(145, 48, '0', 25, '#f1edcf', true).setOrigin(0.5);

    this.text(480, 44, 'Твоя суперсила — вміти додавати', 12, '#b0c6b2').setOrigin(0.5);
    this.text(480, 64, 'Одна правильна відповідь — одна маленька перемога', 9, '#7eaa98').setOrigin(0.5);

    const reset = scene.add.container(868, 48);
    const resetBg = scene.add.graphics().fillStyle(0x0e2c31, 0.44).fillRoundedRect(-65, -22, 130, 44, 12);
    const resetLabel = this.text(0, 0, '↻  Спочатку', 12, '#bed2bd').setOrigin(0.5);
    reset.add([resetBg, resetLabel]).setSize(130, 44).setInteractive({ useHandCursor: true });
    reset.on('pointerover', () => resetLabel.setColor('#ffffff'));
    reset.on('pointerout', () => resetLabel.setColor('#bed2bd'));
    reset.on('pointerdown', actions.restart);

    this.message = this.text(480, 120, 'Обчисли. Обери число. Атакуй!', 15, '#dbe4c0').setOrigin(0.5);
    this.text(224, 217, 'ТВОЄ ЧИСЛО', 10, '#a2c7ba', true).setOrigin(0.5).setLetterSpacing(1.5);
    const pointer = scene.add.graphics();
    pointer.lineStyle(1, 0x9ac5b4, 0.4).lineBetween(224, 232, 224, 251);
    pointer.fillStyle(0xa2c9b9, 0.5).fillCircle(224, 253, 2);

    this.text(224, 402, 'Круглик', 15, '#f1edcd', true).setOrigin(0.5);
    this.text(224, 421, 'маленький герой', 9, '#bbd0ad').setOrigin(0.5);
    this.text(738, 397, 'Лихий', 15, '#f1edcd', true).setOrigin(0.5);
    this.text(738, 416, 'великий любитель загадок', 9, '#bbd0ad').setOrigin(0.5);

    const center = scene.add.graphics();
    center.lineStyle(1, 0xc1d7b3, 0.15).lineBetween(400, 303, 446, 303).lineBetween(514, 303, 560, 303);
    scene.add.star(480, 303, 4, 4, 12, 0xc7dcb6, 0.35);
    for (const x of [388, 572]) center.fillStyle(0xc1d7b3, 0.24).fillCircle(x, 303, 2);

    const panel = scene.add.graphics();
    panel.fillStyle(0x183f39, 0.94).fillRoundedRect(26, 453, 908, 65, 15);
    panel.lineStyle(1, 0xc2d2ab, 0.13).strokeRoundedRect(26, 453, 908, 65, 15);
    this.text(48, 476, 'Готовий до магії?', 13, '#e0e5c9', true);
    this.text(48, 496, 'Обери число та атакуй', 10, '#8da995');
    this.numberButton = this.button(450, 485, 284, 46, 'Space', 'Змінити число', 0x34584f, '#e4e9d2', actions.increment);
    this.attackButton = this.button(756, 485, 292, 46, 'Enter', 'Атакувати  →', 0xe4dda8, '#3e5143', actions.attack);
  }

  private text(x: number, y: number, value: string, size: number, color: string, bold = false): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, value, { fontFamily: FONT_FAMILY, fontSize: `${size}px`, fontStyle: bold ? 'bold' : 'normal', color });
  }

  private button(x: number, y: number, width: number, height: number, key: string, label: string, background: number, textColor: string, action: () => void): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const shape = this.scene.add.graphics();
    shape.fillStyle(background).fillRoundedRect(-width / 2, -height / 2, width, height, 10);
    shape.lineStyle(1, 0xffffff, 0.12).strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
    shape.fillStyle(0x102e2a, 0.12).fillRoundedRect(-width / 2 + 12, -14, 64, 28, 5);
    shape.lineStyle(1, 0xffffff, 0.15).strokeRoundedRect(-width / 2 + 12, -14, 64, 28, 5);
    const keyLabel = this.text(-width / 2 + 44, 0, key, 12, textColor, true).setOrigin(0.5);
    const actionLabel = this.text(25, 0, label, 14, textColor, true).setOrigin(0.5);
    container.add([shape, keyLabel, actionLabel]).setSize(width, height).setInteractive({ useHandCursor: true });
    container.on('pointerover', () => container.setScale(1.02));
    container.on('pointerout', () => container.setScale(1));
    container.on('pointerdown', () => { document.getElementById('game')?.focus({ preventScroll: true }); action(); });
    return container;
  }

  pulseNumberButton(): void {
    this.pulse(this.numberButton);
  }

  private pulse(target: Phaser.GameObjects.Container): void {
    this.scene.tweens.killTweensOf(target);
    target.setScale(0.97);
    this.scene.tweens.add({ targets: target, scale: 1, duration: 150, ease: 'Sine.Out' });
  }

  setAttacking(attacking: boolean): void {
    this.attackButton.setAlpha(attacking ? 0.55 : 1);
    if (attacking) this.pulse(this.attackButton);
  }

  setScore(score: number): void {
    this.scoreLabel.setText(String(score));
    this.scene.tweens.add({ targets: this.scoreLabel, scale: 1.2, duration: 150, yoyo: true });
  }

  showMessage(message: string, color: string, duration = 0): void {
    this.messageTimer?.remove();
    this.message.setText(message).setColor(color);
    if (duration > 0) {
      this.messageTimer = this.scene.time.delayedCall(duration, () => this.message.setText('Обчисли. Обери число. Атакуй!').setColor('#dbe4c0'));
    }
  }
}
