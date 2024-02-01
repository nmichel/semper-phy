import { MetaData } from './agent';

const KEYS = ['PLAYER', 'WALL', 'BOT'] as const;
type KEY_TYPE = (typeof KEYS)[number];

const COLLISION_GROUPS: { [key in KEY_TYPE]: number } = {
  PLAYER: 0,
  WALL: 1,
  BOT: 2,
};

export const PLAYER_METADATA: MetaData = {
  group: COLLISION_GROUPS.PLAYER,
  life: 1,
  power: 1,
};

export const SAUCER_METADATA: MetaData = {
  group: COLLISION_GROUPS.BOT,
  life: 1,
  power: 1,
};
