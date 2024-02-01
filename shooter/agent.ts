import { GameApp } from '../engine/gameApp';
import { RigidBodyGameObject } from '../engine/rigidBodyGameObject';

export type MetaData = {
  group: number;
  life: number;
  power: number;
};

export abstract class Agent extends RigidBodyGameObject {
  constructor(app: GameApp) {
    super(app);
  }

  override buildMetadata(): unknown {
    return this.#metadata;
  }

  set group(group: number) {
    this.#metadata.group = group;
  }

  set life(life: number) {
    this.#metadata.life = life;
  }

  set power(power: number) {
    this.#metadata.power = power;
  }

  #metadata: MetaData = { group: 0, life: 0, power: 0 };
}
