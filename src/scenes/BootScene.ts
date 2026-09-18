import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    this.game.canvas.setAttribute('aria-label', 'Ігрове поле: Круглик ліворуч, Лихий із прикладом праворуч.');
    this.scene.start('GameScene');
  }
}
