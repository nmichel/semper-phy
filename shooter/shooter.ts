import '../physic/engine.js';
import { Scene } from '../physic/scene.js';
import { Vector2 } from '../physic/math.js';
import { GameApp } from '../engine/gameApp';
import { StatsDisplay } from './statsDisplay.js';
import { ScoreDisplay } from './scoreDisplay.js';
import { PhysicEngineGameObject } from '../engine/physicEngineGameObject.js';
import { Background } from './background.js';
import { Ball } from './ball.js';
import { Wall } from './wall.js';

class Shooter extends GameApp {
  constructor(divElement) {
    super(divElement);

    this.#physicScene = new Scene();

    new Background(this);
  
    this.#scoreDisplay = new ScoreDisplay(this);
    new StatsDisplay(this);
    new PhysicEngineGameObject(this, this.#physicScene)

    new Wall(this, this.#physicScene, new Vector2(250, 450), 450, 20);
    new Wall(this, this.#physicScene, new Vector2(20, 250), 20, 400);
    new Wall(this, this.#physicScene, new Vector2(480, 250), 20, 400);
  }

  override onDblclick(_e) {
    this.isRunning = !this.isRunning;
  }

  override onMousemove(e) {
    this.#mousePos = new Vector2(e.offsetX, e.offsetY);
  }

  override onKeydown(e) {
    if (this.isRunning) {
      // new Box(this, this.#physicScene, this.#mousePos, 10 + Math.random() * 20);
      new Ball(this, this.#physicScene, this.#mousePos, 10 + Math.random() * 20);
      this.#scoreDisplay.addScore(1);
    }
  }

  #scoreDisplay: ScoreDisplay;
  #mousePos: Vector2;
  #physicScene: Scene = new Scene();
}

const app3 = new Shooter(document.getElementById('app3'));

