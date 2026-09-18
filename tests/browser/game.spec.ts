import { test as base, expect, type Page } from '@playwright/test';

const test = base.extend<{ runtimeErrors: string[] }>({
  runtimeErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await use(errors);
    expect(errors).toEqual([]);
  }, { auto: true }],
});

async function state(page: Page): Promise<{ first: number; second: number; value: number; score: number }> {
  const status = await page.getByRole('status').textContent();
  const match = status?.match(/Приклад: (\d+) \+ (\d+)\. Число Круглика: (\d+)\. Рахунок: (\d+)\./);
  if (!match) throw new Error(`Unexpected game status: ${status}`);
  return { first: Number(match[1]), second: Number(match[2]), value: Number(match[3]), score: Number(match[4]) };
}

async function choose(page: Page, value: number): Promise<void> {
  const current = await state(page);
  const presses = (value - current.value + 21) % 21;
  for (let i = 0; i < presses; i++) await page.keyboard.press('Space');
  await expect.poll(async () => (await state(page)).value).toBe(value);
}

async function clickCanvas(page: Page, x: number, y: number): Promise<void> {
  const canvas = page.locator('#game canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Missing canvas');
  await canvas.click({ position: { x: x * box.width / 960, y: y * box.height / 540 } });
}

async function expectSharpCanvas(page: Page): Promise<void> {
  await expect.poll(() => page.locator('#game canvas').evaluate((canvas: HTMLCanvasElement) => {
    const bounds = canvas.getBoundingClientRect();
    return canvas.width >= Math.min(bounds.width * devicePixelRatio, 3840) - 1;
  })).toBe(true);
  const metrics = await page.locator('#game canvas').evaluate((canvas: HTMLCanvasElement) => {
    const bounds = canvas.getBoundingClientRect();
    const parent = canvas.parentElement!.getBoundingClientRect();
    return { width: canvas.width, height: canvas.height, ratio: bounds.width / bounds.height,
      contained: bounds.left >= parent.left - 1 && bounds.top >= parent.top - 1 && bounds.right <= parent.right + 1 && bounds.bottom <= parent.bottom + 1 };
  });
  expect(metrics.width).toBeLessThanOrEqual(3840);
  expect(metrics.height).toBeLessThanOrEqual(2160);
  expect(metrics.width / metrics.height).toBeCloseTo(16 / 9, 4);
  expect(metrics.ratio).toBeCloseTo(16 / 9, 4);
  expect(metrics.contained).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('Готовий до атаки.');
});

test('starts with visible canvas, zero number and score, and a valid example', async ({ page }) => {
  await expect(page).toHaveTitle(/Пригоди Круглика/);
  await expect(page.locator('#game canvas')).toBeVisible();
  const initial = await state(page);
  expect(initial.value).toBe(0);
  expect(initial.score).toBe(0);
  expect(initial.first + initial.second).toBeLessThanOrEqual(20);
  await page.screenshot({ path: 'test-results/game-desktop.png', fullPage: true });
});

test('holding Space increments once; all 21 values wrap correctly without scrolling', async ({ page }) => {
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.keyboard.down('Space');
  for (let i = 0; i < 5; i++) await page.keyboard.down('Space');
  await page.waitForTimeout(250);
  expect((await state(page)).value).toBe(1);
  await page.keyboard.up('Space');
  for (let i = 2; i <= 20; i++) {
    await page.keyboard.press('Space');
    expect((await state(page)).value).toBe(i);
  }
  await page.keyboard.press('Space');
  expect((await state(page)).value).toBe(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
});

test('wrong answer leaves the enemy and score unchanged without revealing the answer', async ({ page }) => {
  const initial = await state(page);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('Постріл.');
  await expect(page.getByRole('status')).toContainText('Майже!');
  expect(await state(page)).toEqual(initial);
  await page.screenshot({ path: 'test-results/game-wrong-answer.png', fullPage: true });
});

test('correct answer gives one point and replaces the enemy with a different example', async ({ page }) => {
  const initial = await state(page);
  await choose(page, initial.first + initial.second);
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await state(page)).score).toBe(1);
  await expect(page.getByRole('status')).toContainText('Чудово!');
  await expect(page.getByRole('status')).toContainText('Готовий до атаки.');
  const next = await state(page);
  expect(`${next.first} + ${next.second}`).not.toBe(`${initial.first} + ${initial.second}`);
  expect(next.value).toBe(initial.first + initial.second);
});

test('encounters all eight characters and preserves the current character after a wrong answer', async ({ page }) => {
  test.setTimeout(60_000);
  const getName = async (): Promise<string> => {
    const status = await page.getByRole('status').textContent();
    const name = status?.match(/Лихий: ([^.]+)\./)?.[1];
    if (!name) throw new Error(`Missing enemy name: ${status}`);
    return name;
  };
  const first = await getName();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('Майже!');
  expect(await getName()).toBe(first);

  const encountered: string[] = [];
  for (let i = 0; i < 8; i++) {
    encountered.push(await getName());
    const problem = await state(page);
    await choose(page, problem.first + problem.second);
    await page.keyboard.press('Enter');
    await expect.poll(async () => (await state(page)).score).toBe(i + 1);
    await expect(page.getByRole('status')).toContainText('Готовий до атаки.');
  }
  expect(new Set(encountered).size).toBe(8);
  expect(await getName()).not.toBe(encountered[7]);
});

test('the shot keeps its original answer when Space changes the number in flight', async ({ page }) => {
  const initial = await state(page);
  const answer = initial.first + initial.second;
  await choose(page, answer);
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  expect((await state(page)).value).toBe((answer + 1) % 21);
  await expect.poll(async () => (await state(page)).score).toBe(1);
});

test('repeated Enter cannot award multiple points for one enemy', async ({ page }) => {
  const initial = await state(page);
  await choose(page, initial.first + initial.second);
  await page.keyboard.down('Enter');
  for (let i = 0; i < 6; i++) await page.keyboard.down('Enter');
  await expect.poll(async () => (await state(page)).score).toBe(1);
  await expect(page.getByRole('status')).toContainText('Готовий до атаки.');
  await page.keyboard.down('Enter');
  expect((await state(page)).score).toBe(1);
  await expect(page.getByRole('status')).toContainText('Готовий до атаки.');
  await page.keyboard.up('Enter');
});

test('pointer controls work and restart cleans up held-key listeners and in-flight shots', async ({ page }) => {
  await clickCanvas(page, 450, 485);
  expect((await state(page)).value).toBe(1);
  await clickCanvas(page, 756, 485);
  await expect(page.getByRole('status')).toContainText('Постріл.');
  await clickCanvas(page, 868, 48);
  await expect(page.getByRole('status')).toContainText('Число Круглика: 0. Рахунок: 0. Готовий до атаки.');
  await page.keyboard.press('Space');
  expect((await state(page)).value).toBe(1);
  await page.waitForTimeout(700);
  expect((await state(page)).score).toBe(0);
  await expect(page.getByRole('status')).not.toContainText('Майже!');
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('fits a phone screen and supports touch controls', async ({ page }) => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    const numberButton = page.getByRole('button', { name: /Змінити число/ });
    const attackButton = page.getByRole('button', { name: /Атакувати/ });
    await numberButton.tap();
    expect((await state(page)).value).toBe(1);
    await attackButton.tap();
    await expect(page.getByRole('status')).toContainText('Майже!');
    await page.screenshot({ path: 'test-results/game-mobile.png', fullPage: true });
  });
});

test.describe('high DPI rendering', () => {
  test.use({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });

  test('updates resolution when screen density changes without reloading or resetting the game', async ({ page }) => {
    await clickCanvas(page, 450, 485);
    const before = await state(page);
    const retinaWidth = Number(await page.locator('#game canvas').getAttribute('width'));
    const session = await page.context().newCDPSession(page);
    await session.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await expect.poll(async () => Number(await page.locator('#game canvas').getAttribute('width'))).toBeLessThan(retinaWidth);
    await expectSharpCanvas(page);
    expect(await state(page)).toEqual(before);
    await session.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 2, mobile: false });
    await expect.poll(async () => Number(await page.locator('#game canvas').getAttribute('width'))).toBe(retinaWidth);
    expect(await state(page)).toEqual(before);
    await clickCanvas(page, 450, 485);
    expect((await state(page)).value).toBe(2);
  });

  test('keeps graphics sharp, state intact and pointer controls aligned across fullscreen and resizing', async ({ page }) => {
    await expectSharpCanvas(page);
    const initialWidth = Number(await page.locator('#game canvas').getAttribute('width'));
    const initial = await state(page);
    await choose(page, initial.first + initial.second);
    await clickCanvas(page, 756, 485);
    await expect.poll(async () => (await state(page)).score).toBe(1);
    await expect(page.getByRole('status')).toContainText('Готовий до атаки.');
    const beforeFullscreen = await state(page);
    await page.locator('#fullscreen-toggle').click();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement?.id)).toBe('game-shell');
    await expectSharpCanvas(page);
    expect(Number(await page.locator('#game canvas').getAttribute('width'))).toBeGreaterThan(initialWidth);
    expect(await state(page)).toEqual(beforeFullscreen);
    await page.screenshot({ path: 'test-results/hidpi-fullscreen.png' });
    await clickCanvas(page, 450, 485);
    expect((await state(page)).value).toBe((beforeFullscreen.value + 1) % 21);
    await clickCanvas(page, 868, 48);
    await expect.poll(async () => (await state(page)).score).toBe(0);
    await expectSharpCanvas(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('#fullscreen-toggle')).toHaveAttribute('aria-pressed', 'false');
    await expect.poll(async () => Number(await page.locator('#game canvas').getAttribute('width'))).toBe(initialWidth);
    await page.setViewportSize({ width: 390, height: 844 });
    await expectSharpCanvas(page);
    await clickCanvas(page, 450, 485);
    expect((await state(page)).value).toBe(1);
    await page.locator('#touch-number').click();
    expect((await state(page)).value).toBe(2);
  });
});

test.describe('4K rendering', () => {
  test.use({ viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1 });

  test('renders a full-size 4K buffer and keeps the HUD clickable', async ({ page }) => {
    await page.locator('#fullscreen-toggle').click();
    await expect(page.locator('#fullscreen-toggle')).toHaveAttribute('aria-pressed', 'true');
    await expectSharpCanvas(page);
    await expect(page.locator('#game canvas')).toHaveAttribute('width', '3840');
    await expect(page.locator('#game canvas')).toHaveAttribute('height', '2160');
    await clickCanvas(page, 450, 485);
    expect((await state(page)).value).toBe(1);
  });
});
