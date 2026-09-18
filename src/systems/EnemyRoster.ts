import { ENEMY_VARIANTS, type EnemyKind, type EnemyVariant } from '../entities/enemyVariants.ts';

export class EnemyRoster {
  private remaining: EnemyVariant[] = [];
  private previous?: EnemyKind;
  private readonly random: () => number;

  constructor(random: () => number = Math.random) {
    this.random = random;
  }

  next(): EnemyVariant {
    if (this.remaining.length === 0) {
      // A shuffled bag lets the player meet all eight before any repeats.
      this.remaining = [...ENEMY_VARIANTS];
      for (let i = this.remaining.length - 1; i > 0; i--) {
        const j = Math.floor(this.random() * (i + 1));
        [this.remaining[i], this.remaining[j]] = [this.remaining[j], this.remaining[i]];
      }
      const last = this.remaining.length - 1;
      if (this.remaining[last].id === this.previous) {
        [this.remaining[0], this.remaining[last]] = [this.remaining[last], this.remaining[0]];
      }
    }
    const variant = this.remaining.pop()!;
    this.previous = variant.id;
    return variant;
  }

  reset(): void {
    this.remaining = [];
    this.previous = undefined;
  }
}
