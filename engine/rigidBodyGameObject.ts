import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp, Services } from './gameApp.js';
import { GameObject } from './gameObject.js';
import { Renderable } from './renderingService.js';

export abstract class RigidBodyGameObject extends GameObject implements Renderable {
  constructor(app: GameApp, body: RigidBody, engine: Scene) {
    super(app);
    this.#body = body;
    this.#engine = engine;

    this.#engine.addBody(this.#body);
    this.#body.addListener(this.#handleRigibodyEvent.bind(this));
  }

  /**
   * From GameObject
   */
  override register(services: Services): void {
    services.oobService.register(this);
  }

  override reclaim(): void {
    this.#engine.removeBody(this.#body);
    super.reclaim();
  }

  /**
   * From Renderable
   */
  render(renderer: CanvasRenderingContext2D): void {
    renderer.translate(this.#position.x, this.#position.y);
    renderer.rotate((this.#rotation * Math.PI) / 180);

    this.localRender(renderer);

    renderer.setTransform(1, 0, 0, 1, 0, 0);
  }

  abstract localRender(_renderer: CanvasRenderingContext2D): void;

  get rigidBody(): RigidBody {
    return this.#body;
  }

  #handleRigibodyEvent() {
    this.#position = this.#body.frame.position.clone();
    this.#rotation = this.#body.frame.rotation;
  }

  #body: RigidBody;
  #engine: Scene;
  #position: Vector2;
  #rotation: number = 0;
}
