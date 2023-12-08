import { Render } from '../physic/protocols/protocols.js';
import { Scene } from '../physic/scene.js';
import { GameApp, Renderable, Updatable, Services } from './gameApp.js';
import { GameObject } from './gameObject.js';

export class PhysicEngineGameObject extends GameObject implements Updatable, Renderable {
  constructor(app: GameApp, engine: Scene) {
    super(app);

    this.#engine = engine;
    this.#debug = false;
  }

  override register(services: Services): void {
    services.updateService.register(this);
    services.renderingService.register(this);
  }

  /**
   * From Updatable
   */
  update(dt: number): void {
    this.#engine.step(dt);
  }

  /**
   * From Renderable
   */
  render(renderer: CanvasRenderingContext2D): void {
    if (this.#debug) {
      Render.render(this.#engine, renderer);
    }
  }

  #engine: Scene;
  #debug: boolean;
}
