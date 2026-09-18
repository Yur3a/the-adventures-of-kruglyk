interface InputActions {
  increment: () => void;
  attack: () => void;
}

export class InputController {
  private readonly held = new Set<string>();
  private readonly actions: InputActions;

  constructor(actions: InputActions) {
    this.actions = actions;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.releaseKeys);
    document.addEventListener('visibilitychange', this.releaseKeys);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!['Space', 'Enter', 'NumpadEnter'].includes(event.code)) return;
    if (event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select, [contenteditable="true"]')) return;
    event.preventDefault();
    // Both checks also cover held keys across focus changes and synthetic repeats.
    if (event.repeat || this.held.has(event.code)) return;
    this.held.add(event.code);
    if (event.code === 'Space') this.actions.increment();
    else this.actions.attack();
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.held.delete(event.code);
  };

  private readonly releaseKeys = (): void => {
    this.held.clear();
  };

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.releaseKeys);
    document.removeEventListener('visibilitychange', this.releaseKeys);
    this.held.clear();
  }
}
