import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp } from '../engine/gameApp';
import { RigidBodyGameObject } from '../engine/rigidBodyGameObject';
import { Updatable } from '../engine/updateService';
import { Box } from '../physic/box';
import { EVENTS_NAMES, InputState } from '../engine/eventService.js';

export class Player extends RigidBodyGameObject implements Updatable {
  constructor(app: GameApp, engine: Scene) {
    super(app, new RigidBody(0, new Vector2(100, 100), new Box(100, 100), new Vector2(0, 0), 0, 1000), engine);
  }

  override register(services) {
    services.renderingService.register(this);
    services.updateService.register(this);
    services.eventService.register(this, {
      [EVENTS_NAMES.EVENT_MOUSE_DOWN]: this.handleMouseDown.bind(this),
      [EVENTS_NAMES.EVENT_MOUSE_UP]: this.handleMouseUp.bind(this),
      [EVENTS_NAMES.EVENT_MOUSE_MOVE]: this.handleMouseMove.bind(this),
    });
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.save();
    renderer.globalCompositeOperation = 'lighter';

    renderer.beginPath();
    renderer.roundRect(-50, -50, 100, 100, 10);

    renderer.shadowBlur = 7;
    renderer.shadowColor = 'yellow';
    renderer.strokeStyle = 'rgba(200, 200, 0, 0.5)';
    renderer.lineWidth = 5;
    renderer.stroke();
    renderer.lineWidth = 2;
    renderer.stroke();

    renderer.restore();
  }

  update(_dt: number): void {
    if (this.#direction) {
      this.rigidBody.addForce(this.#direction.clone());
    }
  }

  handleMouseDown(state: InputState): void {
    this.#captured = state.buttonLeft;
  }

  handleMouseUp(state: InputState): void {
    this.#captured = state.buttonLeft;
    if (!this.#captured) {
      this.#direction = null;
    }
  }

  handleMouseMove(state: InputState): void {
    if (this.#captured) {
      this.#direction = state.mousePos.sub(this.rigidBody.frame.position).normalize().scale(10000000);
    }
  }

  #captured: boolean = false;
  #direction: Vector2 = null;
}
