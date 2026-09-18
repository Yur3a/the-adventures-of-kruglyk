import Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { Kruglyk } from '../entities/Kruglyk';
import { Projectile } from '../entities/Projectile';
import { InputController } from '../systems/InputController';
import { MathProblemGenerator, type MathProblem } from '../systems/MathProblemGenerator';
import { GameHud } from '../ui/GameHud';
import { ENEMY_POSITION, FONT_FAMILY, PLAYER_POSITION } from '../utils/constants';
import { drawLandscape } from '../utils/drawLandscape';

type GamePhase = 'ready' | 'shooting' | 'celebrating';

export class GameScene extends Phaser.Scene {
  private player!: Kruglyk;
  private enemy!: Enemy;
  private hud!: GameHud;
  private score = 0;
  private phase: GamePhase = 'ready';
  private readonly generator = new MathProblemGenerator();
  private currentProblem?: MathProblem;
  private feedback = '';

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.score = 0;
    this.phase = 'ready';
    this.feedback = '';
    this.currentProblem = undefined;
    drawLandscape(this);
    this.player = new Kruglyk(this, PLAYER_POSITION.x, PLAYER_POSITION.y);
    this.hud = new GameHud(this, { increment: this.increment, attack: this.attack, restart: () => this.scene.restart() });
    this.spawnEnemy();

    const controller = new InputController({ increment: this.increment, attack: this.attack });
    const touchNumber = document.getElementById('touch-number');
    const touchAttack = document.getElementById('touch-attack');
    touchNumber?.addEventListener('click', this.increment);
    touchAttack?.addEventListener('click', this.attack);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      controller.destroy();
      touchNumber?.removeEventListener('click', this.increment);
      touchAttack?.removeEventListener('click', this.attack);
    });
  }

  private readonly increment = (): void => {
    this.player.increment();
    this.hud.pulseNumberButton();
    this.syncStatus();
  };

  private spawnEnemy(): void {
    this.currentProblem = this.generator.generate(this.currentProblem);
    this.enemy = new Enemy(this, ENEMY_POSITION.x, ENEMY_POSITION.y, this.currentProblem);
    this.phase = 'ready';
    this.feedback = '';
    this.hud.setAttacking(false);
    this.hud.showMessage('Обчисли. Обери число. Атакуй!', '#dbe4c0');
    this.syncStatus();
  }

  private readonly attack = (): void => {
    if (this.phase !== 'ready') return;
    this.phase = 'shooting';
    this.feedback = 'Магія летить!';
    this.hud.setAttacking(true);
    this.player.attack();
    // The projectile owns the answer captured now, even if Space is pressed in flight.
    const projectile = new Projectile(this, this.player.x + 46, this.player.y, this.player.value);
    projectile.flyTo(this.enemy.x - 25, this.enemy.y, (answer) => this.resolveAttack(answer));
    this.syncStatus();
  };

  private resolveAttack(answer: number): void {
    if (answer !== this.enemy.problem.answer) {
      this.enemy.reject();
      this.player.recoil();
      this.phase = 'ready';
      this.feedback = 'Майже! Спробуй інше число.';
      this.hud.setAttacking(false);
      this.hud.showMessage(this.feedback, '#ffc5b7', 2400);
      this.syncStatus();
      return;
    }

    this.phase = 'celebrating';
    this.score += 1;
    this.feedback = 'Чудово! Твоя магія спрацювала!';
    this.hud.setScore(this.score);
    this.hud.showMessage(this.feedback, '#ede7a4');
    const point = this.add.text(this.enemy.x, this.enemy.y - 59, '+1', { fontFamily: FONT_FAMILY, fontSize: '30px', fontStyle: 'bold', color: '#f3e8a2' }).setOrigin(0.5);
    this.tweens.add({ targets: point, y: point.y - 47, alpha: 0, duration: 1000, ease: 'Sine.Out', onComplete: () => point.destroy() });
    this.enemy.defeat(() => this.time.delayedCall(650, () => this.spawnEnemy()));
    this.syncStatus();
  }

  private syncStatus(): void {
    const status = document.getElementById('game-status');
    if (status) {
      const state = this.phase === 'ready' ? 'Готовий до атаки.' : this.phase === 'shooting' ? 'Постріл.' : 'З’являється новий Лихий.';
      status.textContent = `Приклад: ${this.currentProblem?.display}. Число Круглика: ${this.player.value}. Очки: ${this.score}. ${state} ${this.feedback}`;
    }
    const attackButton = document.getElementById('touch-attack');
    if (attackButton instanceof HTMLButtonElement) attackButton.disabled = this.phase !== 'ready';
  }
}
