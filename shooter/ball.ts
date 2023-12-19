import { Circle } from '../physic/circle.js';
import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp, Services } from '../engine/gameApp.js';
import { RigidBodyGameObject } from '../engine/rigidBodyGameObject.js';

export class Ball extends RigidBodyGameObject {
  constructor(app: GameApp, engine: Scene, position: Vector2, radius: number) {
    super(app, new RigidBody(0, position.clone(), new Circle(radius), new Vector2(0, Math.random() * 5 + 1), 0, 100), engine);

    this.#radius = radius;
  }

  override register(services: Services): void {
    super.register(services);
    services.renderingService.register(this);
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.fillStyle = 'white';
    renderer.beginPath();
    renderer.arc(0, 0, this.#radius, 0, 2 * Math.PI);
    renderer.fill();
  }

  #radius: number;
}
