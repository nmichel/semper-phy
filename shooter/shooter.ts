import '../physic/engine.js';
import { Vector2 } from '../physic/math.js';
import { RigidBody } from '../physic/rigidbody.js';
import { GameApp } from '../engine/gameApp';
import { PhysicEngineGameObject } from '../engine/physicEngineGameObject.js';
import { StatsDisplay } from './statsDisplay.js';
import { ScoreDisplay } from './scoreDisplay.js';
import { Background } from './background.js';
import { Ball } from './ball.js';
import { Box } from './box.js';
import { Wall } from './wall.js';
import { Player } from './player.js';
import { Generator, SpawnFun } from './generator.js';
import { GroundTower } from './groundTower.js';
import { RIGIDBODY_GROUPS } from './rigibBodyGroups.js';

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

    const ground = new Wall(this, 800, 20);
    ground.position = new Vector2(400, 450);
    ground.rigidBody.collisionFlags = RIGIDBODY_GROUPS.WALL.group;
    ground.rigidBody.collisionMask = RIGIDBODY_GROUPS.WALL.mask;
    this.addGameObject(ground);

    const back = new Wall(this, 20, 440);
    back.rigidBody.collisionFlags = RIGIDBODY_GROUPS.PLAYER_LIMIT.group;
    back.rigidBody.collisionMask = RIGIDBODY_GROUPS.PLAYER_LIMIT.mask;
    back.position = new Vector2(0, 220);
    this.addGameObject(back);

    const front = new Wall(this, 20, 440);
    front.rigidBody.collisionFlags = RIGIDBODY_GROUPS.PLAYER_LIMIT.group;
    front.rigidBody.collisionMask = RIGIDBODY_GROUPS.PLAYER_LIMIT.mask;
    front.position = new Vector2(800, 220);
    this.addGameObject(front);

    const ceilling = new Wall(this, 800, 20);
    ceilling.position = new Vector2(400, 0);
    ceilling.rigidBody.collisionFlags = RIGIDBODY_GROUPS.PLAYER_LIMIT.group;
    ceilling.rigidBody.collisionMask = RIGIDBODY_GROUPS.PLAYER_LIMIT.mask;
    this.addGameObject(ceilling);

    const player = new Player(this);
    player.position = new Vector2(250, 100);
    this.addGameObject(player);

    const spawnFun: (number) => SpawnFun = (collGroup: number) => (position: Vector2, app: GameApp) => {
      const box = new Box(app, 10 + Math.random() * 20);
      box.rigidBody.collisionFlags = RIGIDBODY_GROUPS.BOT.group;
      box.rigidBody.collisionMask = RIGIDBODY_GROUPS.BOT.mask;
      box.position = position.clone();
      box.velocity = new Vector2(-100 - Math.random() * 500, 0);
      box.color = {
        red: RigidBody.COLLISION_GROUPS.COLLISION_GROUP_1 & collGroup ? 50 + Math.random() * 150 : 0,
        green: RigidBody.COLLISION_GROUPS.COLLISION_GROUP_2 & collGroup ? 50 + Math.random() * 150 : 0,
        blue: RigidBody.COLLISION_GROUPS.COLLISION_GROUP_3 & collGroup ? 50 + Math.random() * 150 : 0,
      };
      this.addGameObject(box);
    };

    const gen1 = new Generator(this, spawnFun(RigidBody.COLLISION_GROUPS.COLLISION_GROUP_1));
    gen1.position = new Vector2(900, 100);
    this.addGameObject(gen1);
    const gen2 = new Generator(this, spawnFun(RigidBody.COLLISION_GROUPS.COLLISION_GROUP_2));
    gen2.position = new Vector2(900, 200);
    this.addGameObject(gen2);
    const gen3 = new Generator(this, spawnFun(RigidBody.COLLISION_GROUPS.COLLISION_GROUP_3));
    gen3.position = new Vector2(900, 300);
    this.addGameObject(gen3);
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
