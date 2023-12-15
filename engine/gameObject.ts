import { Vector2 } from '../physic/math';
import { GameApp, Services } from './gameApp';

export abstract class GameObject {
  constructor(app: GameApp) {
    this.#app = app;

    app.addGameObject(this);
  }

  abstract register(services: Services): void;

  isOffLimits(position: Vector2): boolean {
    return this.#app.isOffLimits(position);
  }

  get id(): number {
    return this.#id;
  }

  get app(): GameApp {
    return this.#app;
  }

  reclaim(): void {
    this.#app.reclaim(this);
  }

  #id: number = Math.ceil(Math.random() * 10000000000);
  #app: GameApp;
}
