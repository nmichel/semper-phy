import { Box as RBBox } from '../physic/box.js';
import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp, Services } from '../engine/gameApp.js';
import { RigidBodyGameObject } from '../engine/rigidBodyGameObject.js';

export class Wall extends RigidBodyGameObject {
  constructor(app: GameApp, engine: Scene, position: Vector2, width: number, height: number) {
    super(app, new RigidBody(0, position.clone(), new RBBox(width, height), new Vector2(0, 0), 0, 0), engine);

    this.#width = width;
    this.#height = height;
  }

  override register(services: Services): void {
    services.renderingService.register(this);
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.fillStyle = 'white';
    renderer.fillRect(-this.#width / 2, -this.#height / 2, this.#width, this.#height);
  }

  #width: number;
  #height: number;
}
