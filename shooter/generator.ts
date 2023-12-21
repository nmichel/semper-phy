import { Vector2 } from '../physic/math';
import { GameApp, Services } from '../engine/gameApp';
import { GameObject } from '../engine/gameObject';
import { Updatable } from '../engine/updateService';
import { Box } from './box';
import { Shooter } from './shooter';

export type SpawnFun = (position: Vector2, app: GameApp) => void;

export class Generator extends GameObject implements Updatable {
  constructor(app: GameApp, spawnFun: SpawnFun) {
    super(app);
    this.#spawnFun = spawnFun;
  }

  set position(position: Vector2) {
    this.#position = position.clone();
  }

  override register(services: Services): void {
    services.updateService.register(this);
  }

  update(dt: number): void {
    this.#time += dt;
    if (this.#time > this.#nextSpawn) {
      this.#time = 0;
      this.#nextSpawn = 50 + Math.random() * 100;
      this.#spawn();
    }
  }

  #spawn() {
    this.#spawnFun(this.#position, this.app);
  }

  #spawnFun: SpawnFun;
  #time: number = 0;
  #nextSpawn: number = 0;
  #position: Vector2 = new Vector2(0, 0);
}
