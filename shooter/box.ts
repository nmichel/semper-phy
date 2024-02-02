import { Box as RBBox } from '../physic/box.js';
import { RigidBody } from '../physic/rigidbody.js';
import { Vector2 } from '../physic/math.js';
import { GameApp, Services } from '../engine/gameApp.js';
import { Agent } from './agent.js';

export type Color = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};

export class Box extends Agent {
  constructor(app: GameApp, side: number) {
    super(app);

    this.#side = side;
  }

  set color(color: Color) {
    this.#color = { ...color };
  }

  override register(services: Services): void {
    super.register(services);
    services.renderingService.register(this);
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.save();
    renderer.globalCompositeOperation = 'lighter';

    renderer.beginPath();
    renderer.rect(-this.#side * 10 / 2, -this.#side * 10 / 2, this.#side * 10, this.#side * 10);

    renderer.shadowBlur = 5;
    renderer.shadowColor = `rgb(${this.#color.red}, ${this.#color.green}, ${this.#color.blue})`;
    renderer.strokeStyle = `rgba(${this.#color.red}, ${this.#color.green}, ${this.#color.blue}, ${this.#color.alpha ?? 1})`;
    renderer.lineWidth = 3;
    renderer.stroke();
    renderer.lineWidth = 1;
    renderer.stroke();

    renderer.restore();
  }

  override buildRigidBody(): RigidBody {
    return new RigidBody(new RBBox(this.#side, this.#side), new Vector2(0, Math.random() * 5 + 1), 0, 0.2);
  }

  #side: number;
  #color: Color = { red: 255, green: 255, blue: 255 };
}
