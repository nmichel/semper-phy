import { RigidBody } from '../physic/rigidbody.js';
import { Vector2 } from '../physic/math.js';
import { GameApp, Services } from './gameApp.js';
import { GameObject } from './gameObject.js';
import { Renderable } from './renderingService.js';
import { Explosion } from '../shooter/explosion.js';

export abstract class RigidBodyGameObject extends GameObject implements Renderable {
  constructor(app: GameApp) {
    super(app);
  }

  /**
   * From GameObject
   */
  override register(services: Services): void {
    this.rigidBody.addListener({
      handleFrameUpdated: this.handleRigibodyFrameUpdated.bind(this),
      handleCollision: this.handleRigibodyFrameCollision.bind(this),
    });

    services.oobService.register(this);
    services.physicService.register(this);
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
    if (!this.#body) {
      this.#body = this.buildRigidBody();
    }

    return this.#body;
  }

  abstract buildRigidBody(): RigidBody;

  get rotation(): number {
    return this.rigidBody.frame.rotation;
  }

  set rotation(angle: number) {
    this.rigidBody.frame.rotation = angle;
  }

  get position(): Vector2 {
    return this.rigidBody.frame.position.clone();
  }

  set position(position: Vector2) {
    this.#position = position.clone();
    this.rigidBody.frame.position = position.clone();
  }

  set velocity(velocity: Vector2) {
    this.rigidBody.linearVelocity = velocity.clone();
  }

  handleRigibodyFrameUpdated() {
    this.#position = this.#body.frame.position.clone();
    this.#rotation = this.#body.frame.rotation;
  }

  handleRigibodyFrameCollision(me: RigidBody, other: RigidBody, collision: unknown) {
    if (me.inverseMass > 0 && this.#collisionCount++ > 10) {
      const explosion = new Explosion(this.app);
      explosion.position = this.position;
      this.app.addGameObject(explosion);

      this.reclaim();
    }
  }

  #body: RigidBody;
  #position: Vector2 = new Vector2(0, 0);
  #rotation: number = 0;
  #collisionCount: number = 0;
}
