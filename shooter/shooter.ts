import '../physic/engine.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
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
    this.addGameObject(ground);

    // new Wall(this, this.physicScene, new Vector2(20, 350), 20, 200);
    // new Wall(this, this.physicScene, new Vector2(800, 350), 20, 200);

    const player = new Player(this);
    player.position = new Vector2(100, 100);
    this.addGameObject(player);

    const spawnFun: SpawnFun = (position: Vector2, app: GameApp) => {
      const box = new Box(app, 10 + Math.random() * 20);
      box.position = position.clone();
      box.velocity = new Vector2(-100 - Math.random() * 500, 0);
      box.color = {
        red: 50 + Math.random() * 150,
        green: 50 + Math.random() * 150,
        blue: 0,
      };
      this.addGameObject(box);
    };

    const gen1 = new Generator(this, spawnFun);
    gen1.position = new Vector2(900, 100);
    this.addGameObject(gen1);
    const gen2 = new Generator(this, spawnFun);
    gen2.position = new Vector2(900, 200);
    this.addGameObject(gen2);
    const gen3 = new Generator(this, spawnFun);
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
