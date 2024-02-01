import { Circle } from '../physic/circle.js';
import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp, Services } from '../engine/gameApp.js';
import { Agent } from './agent.js';

export class Ball extends Agent {
  constructor(app: GameApp, radius: number) {
    super(app);

    this.#radius = radius;
  }

  /**
   * From GameObject
   */
  override register(services: Services): void {
    super.register(services);
    services.renderingService.register(this);
  }

  /**
   * From RigidbodyGameObject
   */
  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.strokeStyle = 'orange';
    renderer.beginPath();
    renderer.arc(0, 0, this.#radius * 10, 0, 2 * Math.PI);
    renderer.stroke();
  }

  /**
   * From RigidbodyGameObject
   */
  override buildRigidBody(): RigidBody {
    return new RigidBody(0, new Vector2(0, 0), new Circle(this.#radius), new Vector2(0, Math.random() * 5 + 1), 0, 0.2);
  }

  #radius: number;
}
