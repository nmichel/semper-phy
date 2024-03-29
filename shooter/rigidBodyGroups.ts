import { RigidBody } from '../physic/Rigidbody.js';

const PLAYER_GROUP = RigidBody.COLLISION_GROUPS.COLLISION_GROUP_1;
const PLAYER_MASK = RigidBody.COLLISION_GROUPS.ALL_GROUPS ^ (RigidBody.COLLISION_GROUPS.COLLISION_GROUP_2 | PLAYER_GROUP);

const PLAYER_LIMIT_GROUP = RigidBody.COLLISION_GROUPS.COLLISION_GROUP_3;
const PLAYER_LIMIT_MASK = PLAYER_GROUP;

const PLAYER_SHOOT_GROUP = RigidBody.COLLISION_GROUPS.COLLISION_GROUP_2;
const PLAYER_SHOOT_MASK = RigidBody.COLLISION_GROUPS.ALL_GROUPS ^ (PLAYER_GROUP | PLAYER_SHOOT_GROUP);

const BOT_GROUP = RigidBody.COLLISION_GROUPS.COLLISION_GROUP_4;
const BOT_MASK = RigidBody.COLLISION_GROUPS.ALL_GROUPS ^ RigidBody.COLLISION_GROUPS.COLLISION_GROUP_4;

const KEYS = ['PLAYER', 'PLAYER_LIMIT', 'PLAYER_SHOOT', 'WALL', 'BOT'] as const;
type KEY_TYPE = (typeof KEYS)[number];

export const RIGIDBODY_GROUPS: { [key in KEY_TYPE]: { group: number; mask: number } } = {
  PLAYER: {
    group: PLAYER_GROUP,
    mask: PLAYER_MASK,
  },
  PLAYER_LIMIT: {
    group: PLAYER_LIMIT_GROUP,
    mask: PLAYER_LIMIT_MASK,
  },
  PLAYER_SHOOT: {
    group: PLAYER_SHOOT_GROUP,
    mask: PLAYER_SHOOT_MASK,
  },
  WALL: {
    group: RigidBody.COLLISION_GROUPS.COLLISION_GROUP_0,
    mask: RigidBody.COLLISION_GROUPS.ALL_GROUPS,
  },
  BOT: {
    group: BOT_GROUP,
    mask: BOT_MASK,
  },
};
