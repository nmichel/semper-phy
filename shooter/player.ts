import { RigidBody } from '../physic/rigidbody.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/Math.js';
import { GameApp } from '../engine/gameApp';
import { RigidBodyGameObject } from '../engine/rigidBodyGameObject';
import { Updatable } from '../engine/updateService';
import { Box } from '../physic/Box.js';
import { Box as GameObjectBox } from './box';
import { EVENTS_NAMES, InputState } from '../engine/eventService.js';
import { Shooter } from './shooter.js';
import { RIGIDBODY_GROUPS } from './rigidBodyGroups.js';
import { PLAYER_METADATA } from './agentData.js';
import { Agent } from './agent.js';

const WIDTH: number = 4;
const HEIGHT: number = 2;
const HALF_WIDTH: number = WIDTH / 2;
const HALF_HEIGHT: number = HEIGHT / 2;

export class Player extends Agent implements Updatable {
  constructor(app: GameApp) {
    super(app);

    this.group = PLAYER_METADATA.group;
    this.life = PLAYER_METADATA.life;
    this.power = PLAYER_METADATA.power;
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
      [EVENTS_NAMES.EVENT_KEY_UP]: this.handleKeyUp.bind(this),
    });
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.save();
    renderer.globalCompositeOperation = 'lighter';

    renderer.beginPath();
    renderer.roundRect(-HALF_WIDTH * 10, -HALF_HEIGHT * 10, WIDTH * 10, HEIGHT * 10, 5);

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
    const body = new RigidBody(new Box(WIDTH, HEIGHT), 0.1);
    body.flags = RigidBody.FLAGS.LOCK_ROTATION;
    body.collisionFlags = RIGIDBODY_GROUPS.PLAYER.group;
    body.collisionMask = RIGIDBODY_GROUPS.PLAYER.mask;
    return body;
  }

  override handleRigibodyFrameCollision(me: RigidBody, other: RigidBody, collision: unknown) {}

  update(_dt: number): void {
    if (this.#direction.length() > 0) {
      this.rigidBody.addForce(this.#direction.clone());
    }
  }

  handleMouseDown(state: InputState): void {
    this.#captured = state.buttonLeft;
  }

  handleMouseUp(state: InputState): void {
    this.#captured = state.buttonLeft;
  }

  handleMouseMove(state: InputState): void {}

  handleKeyDown(state: InputState): void {
    this.updateLocalStateFromInput(state);
  }

  handleKeyUp(state: InputState): void {
    this.updateLocalStateFromInput(state);
  }

  handleShoot(state: InputState): void {
    const shootDispersion = Math.PI / 3;
    const shootSpeed = 300;
    const shootAngle = Math.random() * shootDispersion - shootDispersion / 2;
    const shootDirection = new Vector2(Math.cos(shootAngle), Math.sin(shootAngle));
    const shoot = new GameObjectBox(this.app, 10 + Math.random() * 20);
    shoot.position = this.position.clone().addToSelf(new Vector2(80, 0));
    shoot.velocity = shootDirection.scale(shootSpeed);
    shoot.rigidBody.collisionFlags = RIGIDBODY_GROUPS.PLAYER_SHOOT.group;
    shoot.rigidBody.collisionMask = RIGIDBODY_GROUPS.PLAYER_SHOOT.mask;
    this.app.addGameObject(shoot);

    // this.app.addGameObject(shoot);
    // // new Ball(this.app, (this.app as Shooter).physicScene, state.mousePos.clone(), 10 + Math.random() * 20);
    (this.app as Shooter).scoreDisplay.addScore(1);
  }

  handleArrowUp(state: InputState): void {
    this.#direction.addToSelf(new Vector2(0, -this.#thrustInN));
  }

  handleArrowDown(state: InputState): void {
    this.#direction.addToSelf(new Vector2(0, this.#thrustInN));
  }

  handleArrowLeft(state: InputState): void {
    this.#direction.addToSelf(new Vector2(-this.#thrustInN, 0));
  }

  handleArrowRight(state: InputState): void {
    this.#direction.addToSelf(new Vector2(this.#thrustInN, 0));
  }

  updateLocalStateFromInput(state: InputState): void {
    if (state.keys.indexOf(' ') !== -1) {
      this.handleShoot(state);
    }

    this.#direction = new Vector2(0, 0);

    if (state.keys.indexOf('arrowup') !== -1) {
      this.handleArrowUp(state);
    }

    if (state.keys.indexOf('arrowdown') !== -1) {
      this.handleArrowDown(state);
    }

    if (state.keys.indexOf('arrowleft') !== -1) {
      this.handleArrowLeft(state);
    }

    if (state.keys.indexOf('arrowright') !== -1) {
      this.handleArrowRight(state);
    }
  }

  #captured: boolean = false;
  #direction: Vector2 = new Vector2(0, 0);
  #thrustInN: number = 20;
}
