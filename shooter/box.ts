import { Box as RBBox } from '../physic/box.js';
import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp, Services } from '../engine/gameApp.js';
import { RigidBodyGameObject } from '../engine/rigidBodyGameObject.js';

export class Box extends RigidBodyGameObject {
  constructor(app: GameApp, engine: Scene, position: Vector2, side: number) {
    super(app, new RigidBody(0, position.clone(), new RBBox(side, side), new Vector2(0, Math.random() * 5 + 1), 0, side * side), engine);

    this.#side = side;
  }

  override register(services: Services): void {
    services.renderingService.register(this);
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.fillStyle = 'white';
    renderer.fillRect(-this.#side / 2, -this.#side / 2, this.#side, this.#side);
  }

  #side: number;
}
