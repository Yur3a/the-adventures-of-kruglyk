export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const MAX_NUMBER = 20;
export const FONT_FAMILY = '"Trebuchet MS", "Segoe UI", sans-serif';
export const PLAYER_POSITION = { x: 224, y: 316 };
export const ENEMY_POSITION = { x: 738, y: 308 };

export function nextNumber(current: number): number {
  return (current + 1) % (MAX_NUMBER + 1);
}
