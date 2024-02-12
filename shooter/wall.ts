import { Box as RBBox } from '../physic/Box.js';
import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/Math.js';
import { GameApp, Services } from '../engine/gameApp.js';
import { Agent } from './agent.js';

export class Wall extends Agent {
  constructor(app: GameApp, width: number, height: number) {
    super(app);

    this.#width = width;
    this.#height = height;
  }

  override register(services: Services): void {
    super.register(services);
    services.renderingService.register(this);
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.fillStyle = 'white';
    renderer.fillRect((-this.#width * 10) / 2, (-this.#height * 10) / 2, this.#width * 10, this.#height * 10);
  }

  override buildRigidBody(): RigidBody {
    return new RigidBody(new RBBox(this.#width, this.#height), 0);
  }

  #width: number;
  #height: number;
}
