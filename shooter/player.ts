import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp } from '../engine/gameApp';
import { RigidBodyGameObject } from '../engine/rigidBodyGameObject';
import { Updatable } from '../engine/updateService';
import { Box } from '../physic/box';
import { Box as GameObjectBox } from './box';
import { EVENTS_NAMES, InputState } from '../engine/eventService.js';
import { Shooter } from './shooter.js';

export class Player extends RigidBodyGameObject implements Updatable {
  constructor(app: GameApp) {
    super(app);
  }

  override register(services): void {
    super.register(services);

    services.renderingService.register(this);
    services.updateService.register(this);
    services.eventService.register(this, {
      [EVENTS_NAMES.EVENT_MOUSE_DOWN]: this.handleMouseDown.bind(this),
      [EVENTS_NAMES.EVENT_MOUSE_UP]: this.handleMouseUp.bind(this),
      [EVENTS_NAMES.EVENT_MOUSE_MOVE]: this.handleMouseMove.bind(this),
      [EVENTS_NAMES.EVENT_KEY_DOWN]: this.handleKeyDown.bind(this),
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

  override buildRigidBody(): RigidBody {
    return new RigidBody(0, new Vector2(0, 0), new Box(100, 100), new Vector2(0, 0), 0, 1000);
  }

  override handleRigibodyFrameCollision(me: RigidBody, other: RigidBody, collision: unknown) {}

  update(_dt: number): void {
    const position = this.position;
    if (position.x < 100) {
      position.x = 100;
    } else if (position.x > 700) {
      position.x = 700;
    }
    if (position.y < 100) {
      position.y = 100;
    }

    this.position = new Vector2(position.x, position.y);

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

  handleKeyDown(state: InputState): void {
    const shootDispersion = Math.PI / 3;
    const shootSpeed = 300;
    const shootAngle = Math.random() * shootDispersion - shootDispersion / 2;
    const shootDirection = new Vector2(Math.cos(shootAngle), Math.sin(shootAngle));
    const shoot = new GameObjectBox(this.app, 10 + Math.random() * 20);
    shoot.position = this.position.clone().addToSelf(new Vector2(80, 0));
    shoot.velocity = shootDirection.scale(shootSpeed);
    this.app.addGameObject(shoot);

    // this.app.addGameObject(shoot);
    // // new Ball(this.app, (this.app as Shooter).physicScene, state.mousePos.clone(), 10 + Math.random() * 20);
    (this.app as Shooter).scoreDisplay.addScore(1);
  }

  #captured: boolean = false;
  #direction: Vector2 = null;
}
