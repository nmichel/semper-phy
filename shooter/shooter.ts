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

class Shooter extends GameApp {
  constructor(divElement) {
    super(divElement);

    this.physicScene = new Scene();

    new Background(this);

    this.scoreDisplay = new ScoreDisplay(this);
    new StatsDisplay(this);
    new PhysicEngineGameObject(this, this.physicScene);

    new Wall(this, this.physicScene, new Vector2(410, 450), 800, 20);
    new Wall(this, this.physicScene, new Vector2(20, 250), 20, 400);
    new Wall(this, this.physicScene, new Vector2(800, 250), 20, 400);

    new (class extends GameObject {
      constructor(app: Shooter) {
        super(app);
      }

      override register(services: Services): void {
        services.eventService.register(this, {
          [EVENTS_NAMES.EVENT_KEY_DOWN]: this.handleKeyDown.bind(this),
        });
      }

      handleKeyDown(state: InputState): void {
        new Box(this.app, (this.app as Shooter).physicScene, state.mousePos.clone(), 10 + Math.random() * 20);
        // // new Ball(this.app, (this.app as Shooter).physicScene, state.mousePos.clone(), 10 + Math.random() * 20);
        (this.app as Shooter).scoreDisplay.addScore(1);
      }
    })(this);

    new Player(this, this.physicScene);
  }

  override onDblclick(_e): void {
    this.isRunning = !this.isRunning;
    super.onDblclick(_e);
  }

  override isOffLimits(position: Vector2): boolean {
    return position.y > 1000;
  }

  scoreDisplay: ScoreDisplay;
  physicScene: Scene = new Scene();
}

const app3 = new Shooter(document.getElementById('app3'));
