import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { GAME_HEIGHT, GAME_WIDTH } from './utils/constants';
import { setupFullscreen } from './ui/fullscreen';
import './style.css';

const game = new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#163d41',
  antialias: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, GameScene],
  input: { activePointers: 2 },
  render: { roundPixels: false },
});

const cleanupFullscreen = setupFullscreen(() => {
  if (game.isBooted) game.scale.refresh();
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanupFullscreen();
    game.destroy(true);
  });
}
