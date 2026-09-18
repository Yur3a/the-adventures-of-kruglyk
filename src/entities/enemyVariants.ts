export type EnemyKind = 'grump' | 'ember' | 'slime' | 'spike' | 'cloud' | 'crystal' | 'mushroom' | 'cyclops';

export interface EnemyVariant {
  readonly id: EnemyKind;
  readonly name: string;
  readonly body: number;
  readonly shade: number;
  readonly accent: number;
  readonly lift: number;
  readonly sway: number;
  readonly duration: number;
}

export const ENEMY_VARIANTS: readonly EnemyVariant[] = [
  { id: 'grump', name: 'Буркотун', body: 0x735493, shade: 0x533c72, accent: 0xb49acf, lift: 5, sway: 2, duration: 1450 },
  { id: 'ember', name: 'Жарик', body: 0xe8874f, shade: 0xb8533d, accent: 0xffcd7c, lift: 6, sway: -3, duration: 900 },
  { id: 'slime', name: 'Капосник', body: 0x58b5ac, shade: 0x32827d, accent: 0xb1eee0, lift: 3, sway: -2, duration: 1700 },
  { id: 'spike', name: 'Колючка', body: 0xbc6392, shade: 0x813e70, accent: 0xf2b0ce, lift: 4, sway: 3, duration: 1100 },
  { id: 'cloud', name: 'Хмарник', body: 0x95a5c3, shade: 0x657897, accent: 0xdce7fa, lift: 9, sway: -2, duration: 1900 },
  { id: 'crystal', name: 'Кристалик', body: 0x8e8ade, shade: 0x56559f, accent: 0xd0ceff, lift: 6, sway: 2, duration: 1500 },
  { id: 'mushroom', name: 'Грибун', body: 0xcf6860, shade: 0x964c4c, accent: 0xf9d7ae, lift: 3, sway: -3, duration: 1300 },
  { id: 'cyclops', name: 'Зубчик', body: 0xdcb351, shade: 0xa47a35, accent: 0xffe4a1, lift: 4, sway: 2, duration: 1200 },
];
