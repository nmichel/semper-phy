import '../physic/engine.js';
import { Vector2 } from '../physic/Math.js';
import { RigidBody } from '../physic/Rigidbody.js';
import { GameApp } from '../engine/gameApp';
import { PhysicEngineGameObject } from '../engine/physicEngineGameObject.js';
import { StatsDisplay } from './statsDisplay.js';
import { ScoreDisplay } from './scoreDisplay.js';
import { Background } from './background.js';
import { Agent } from './agent.js';
import { Ball } from './ball.js';
import { Box } from './box.js';
import { Wall } from './wall.js';
import { Player } from './player.js';
import { Generator, SpawnFun } from './generator.js';
import { RIGIDBODY_GROUPS } from './rigidBodyGroups.js';
import { Saucer } from './saucer.js';

export class Shooter extends GameApp {
  constructor(divElement) {
    super(divElement);

    new Background(this);

    this.scoreDisplay = new ScoreDisplay(this);
    this.addGameObject(this.scoreDisplay);

    const statsDisplay = new StatsDisplay(this);
    this.addGameObject(statsDisplay);

    const physic = new PhysicEngineGameObject(this);
    this.addGameObject(physic);

    const ground = new Wall(this, 80, 2);
    ground.position = new Vector2(40, 45);
    ground.rigidBody.collisionFlags = RIGIDBODY_GROUPS.WALL.group;
    ground.rigidBody.collisionMask = RIGIDBODY_GROUPS.WALL.mask;
    this.addGameObject(ground);

    const back = new Wall(this, 2, 44);
    back.rigidBody.collisionFlags = RIGIDBODY_GROUPS.PLAYER_LIMIT.group;
    back.rigidBody.collisionMask = RIGIDBODY_GROUPS.PLAYER_LIMIT.mask;
    back.position = new Vector2(0, 22);
    this.addGameObject(back);

    const front = new Wall(this, 2, 44);
    front.rigidBody.collisionFlags = RIGIDBODY_GROUPS.PLAYER_LIMIT.group;
    front.rigidBody.collisionMask = RIGIDBODY_GROUPS.PLAYER_LIMIT.mask;
    front.position = new Vector2(80, 22);
    this.addGameObject(front);

    const ceilling = new Wall(this, 80, 2);
    ceilling.position = new Vector2(40, 0);
    ceilling.rigidBody.collisionFlags = RIGIDBODY_GROUPS.PLAYER_LIMIT.group;
    ceilling.rigidBody.collisionMask = RIGIDBODY_GROUPS.PLAYER_LIMIT.mask;
    this.addGameObject(ceilling);

    const player = new Player(this);
    player.position = new Vector2(25, 10);
    this.addGameObject(player);

    const spawnSaucerFun: SpawnFun = (position: Vector2, app: GameApp): void => {
      const t: 0 | 1 | 2  = Math.round(Math.random() * 2) as 0 | 1 | 2;
      let box: Agent;
      switch (t) {
        case 0:
          box = new Box(app, 1);
          break;
        case 1:
          box = new Ball(app, 1);
          break;
        case 2:
          box = new Saucer(app)
          break;
      }

      box.rigidBody.collisionFlags = RIGIDBODY_GROUPS.BOT.group;
      box.rigidBody.collisionMask = RigidBody.COLLISION_GROUPS.ALL_GROUPS;
      box.position = position.clone();
      this.addGameObject(box);
    };

    const gen1 = new Generator(this, spawnSaucerFun, 100);
    gen1.position = new Vector2(60, 10);
    this.addGameObject(gen1);
  }

  override onDblclick(_e): void {
    this.isRunning = !this.isRunning;
    super.onDblclick(_e);
  }

  override onMouseout(e) {}

  override isOffLimits(position: Vector2): boolean {
    return position.y > 1000 || position.y < -1000 || position.x < -1000;
  }

  scoreDisplay: ScoreDisplay;
}

const app3 = new Shooter(document.getElementById('app3'));
app3.start();
