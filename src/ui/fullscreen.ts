export function setupFullscreen(onResize: () => void): () => void {
  const shell = document.getElementById('game-shell');
  const stage = document.getElementById('game');
  const button = document.querySelector<HTMLButtonElement>('#fullscreen-toggle');
  const label = button?.querySelector('span');
  if (!shell || !stage || !button || !label) return () => {};

  let expandedInPage = false;
  let switching = false;
  let resizeFrame = 0;
  const isFullscreen = (): boolean => expandedInPage || document.fullscreenElement === shell;

  const sync = (): void => {
    const active = isFullscreen();
    shell.classList.toggle('is-fullscreen', active);
    document.documentElement.classList.toggle('game-expanded', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Вийти з повноекранного режиму' : 'На весь екран');
    button.title = active ? 'Вийти з повноекранного режиму (Esc)' : 'На весь екран';
    label.textContent = active ? 'Згорнути' : 'На весь екран';
    stage.focus({ preventScroll: true });
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(onResize);
  };

  const toggle = async (): Promise<void> => {
    if (switching) return;
    switching = true;
    const entering = !isFullscreen();
    try {
      if (expandedInPage) {
        expandedInPage = false;
      } else if (document.fullscreenElement === shell) {
        await document.exitFullscreen();
      } else if (document.fullscreenEnabled && shell.requestFullscreen) {
        await shell.requestFullscreen({ navigationUI: 'hide' });
      } else {
        expandedInPage = true;
      }
    } catch {
      // Some mobile browsers and embedded views only allow filling the browser viewport.
      if (entering && !document.fullscreenElement) expandedInPage = true;
    } finally {
      switching = false;
      sync();
    }
  };

  const onClick = (): void => { void toggle(); };
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.code === 'Escape' && !event.repeat && isFullscreen()) void toggle();
  };
  const observer = new ResizeObserver(onResize);
  observer.observe(stage);
  button.addEventListener('click', onClick);
  document.addEventListener('fullscreenchange', sync);
  window.addEventListener('keydown', onKeyDown);

  return () => {
    observer.disconnect();
    cancelAnimationFrame(resizeFrame);
    button.removeEventListener('click', onClick);
    document.removeEventListener('fullscreenchange', sync);
    window.removeEventListener('keydown', onKeyDown);
    document.documentElement.classList.remove('game-expanded');
    shell.classList.remove('is-fullscreen');
  };
}
