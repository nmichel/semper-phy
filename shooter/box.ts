import { Box as RBBox } from '../physic/box.js';
import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp, Services } from '../engine/gameApp.js';
import { RigidBodyGameObject } from '../engine/rigidBodyGameObject.js';

export type Color = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};

export class Box extends RigidBodyGameObject {
  constructor(app: GameApp, engine: Scene, position: Vector2, side: number) {
    super(
      app,
      new RigidBody(0, position.clone(), new RBBox(side, side), new Vector2(0, Math.random() * 5 + 1), 0, side * side),
      engine
    );

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
    renderer.rect(-this.#side / 2, -this.#side / 2, this.#side, this.#side);

    renderer.shadowBlur = 5;
    renderer.shadowColor = `rgb(${this.#color.red}, ${this.#color.green}, ${this.#color.blue})`;
    renderer.strokeStyle = `rgba(${this.#color.red}, ${this.#color.green}, ${this.#color.blue}, ${this.#color.alpha ?? 1})`;
    renderer.lineWidth = 3;
    renderer.stroke();
    renderer.lineWidth = 1;
    renderer.stroke();

    renderer.restore();
  }

  #side: number;
  #color: Color = { red: 255, green: 255, blue: 255 };
}
