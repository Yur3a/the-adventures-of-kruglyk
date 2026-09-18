import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, MAX_RENDER_SCALE } from '../utils/constants';

export function setupHighDpiRendering(scene: Phaser.Scene): void {
  let resizing = false;

  const resize = (): void => {
    if (resizing) return;
    resizing = true;
    try {
      const parent = scene.scale.parentSize;
      const displayScale = Math.min(parent.width / GAME_WIDTH, parent.height / GAME_HEIGHT);
      const pixelScale = displayScale * (window.devicePixelRatio || 1);
      // Half steps keep both buffer dimensions even; the 4K cap limits canvas memory.
      const renderScale = Phaser.Math.Clamp(Math.ceil(pixelScale * 2) / 2, 1, MAX_RENDER_SCALE);
      const width = GAME_WIDTH * renderScale;
      const height = GAME_HEIGHT * renderScale;

      if (scene.scale.width !== width || scene.scale.height !== height) {
        scene.scale.setGameSize(width, height);
      }
      // Keep the world and pointer hit areas in their original 960 × 540 coordinates.
      scene.cameras.main.setSize(width, height).setZoom(renderScale).centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    } finally {
      resizing = false;
    }
  };

  let pixelRatio = window.devicePixelRatio || 1;
  const checkDensity = (): void => {
    const nextRatio = window.devicePixelRatio || 1;
    // Density can change without a resize or media-query event when moving between displays.
    if (nextRatio !== pixelRatio) {
      pixelRatio = nextRatio;
      resize();
    }
  };

  scene.scale.on(Phaser.Scale.Events.RESIZE, resize);
  scene.events.on(Phaser.Scenes.Events.PRE_UPDATE, checkDensity);
  resize();

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.scale.off(Phaser.Scale.Events.RESIZE, resize);
    scene.events.off(Phaser.Scenes.Events.PRE_UPDATE, checkDensity);
  });
}
