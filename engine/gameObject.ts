import { GameApp, Services } from "./gameApp";

export class GameObject {
  constructor(app: GameApp) {
    this.#app = app;
  
    app.register(this);
  }

  register(services: Services): void {
    throw new Error("Method not implemented.");
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

  #id: number = Math.random() * 10000000000;
  #app: GameApp;
}
