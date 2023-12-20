import '../physic/engine.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp, Services } from '../engine/gameApp';
import { PhysicEngineGameObject } from '../engine/physicEngineGameObject.js';
import { GameObject } from '../engine/gameObject.js';
import { StatsDisplay } from './statsDisplay.js';
import { ScoreDisplay } from './scoreDisplay.js';
import { Background } from './background.js';
import { Ball } from './ball.js';
import { Box } from './box.js';
import { Wall } from './wall.js';
import { EVENTS_NAMES, InputState } from '../engine/eventService.js';
import { Player } from './player.js';
import { Generator, SpawnFun } from './generator.js';
import { GroundTower } from './groundTower.js';

export class Shooter extends GameApp {
  constructor(divElement) {
    super(divElement);

    this.physicScene = new Scene();

    new Background(this);

    this.scoreDisplay = new ScoreDisplay(this);
    new StatsDisplay(this);
    new PhysicEngineGameObject(this, this.physicScene);

    new Wall(this, this.physicScene, new Vector2(410, 450), 800, 20);
    // new Wall(this, this.physicScene, new Vector2(20, 350), 20, 200);
    // new Wall(this, this.physicScene, new Vector2(800, 350), 20, 200);

    new Player(this);

    const spawnFun: SpawnFun = (position: Vector2, app: GameApp) => {
      const box = new Box(app, (app as Shooter).physicScene, position.clone(), 10 + Math.random() * 20);
      box.velocity = new Vector2(-100 - Math.random() * 500, 0);
      box.color = {
        red: 50 + Math.random() * 150,
        green: 50 + Math.random() * 150,
        blue: 0,
      };
    };

    new Generator(this, spawnFun).position = new Vector2(900, 100);
    new Generator(this, spawnFun).position = new Vector2(900, 200);
    new Generator(this, spawnFun).position = new Vector2(900, 300);
  }

  override onDblclick(_e): void {
    this.isRunning = !this.isRunning;
    super.onDblclick(_e);
  }

  override isOffLimits(position: Vector2): boolean {
    return position.y > 1000 || position.y < -1000 || position.x < -1000;
  }

  scoreDisplay: ScoreDisplay;
  physicScene: Scene = new Scene();
}

const app3 = new Shooter(document.getElementById('app3'));
