import { RigidBody } from '../physic/rigidbody.js';
import { Box } from '../physic/box.js';
import { Vector2 } from '../physic/math.js';
import { GameApp } from '../engine/gameApp';
import { Updatable } from '../engine/updateService';
import { Color } from './box';
import { Agent } from './agent.js';
import { SAUCER_METADATA } from './agentData.js';

export class Saucer extends Agent implements Updatable {
  constructor(app: GameApp) {
    super(app);

    this.group = SAUCER_METADATA.group;
    this.life = SAUCER_METADATA.life;
    this.power = SAUCER_METADATA.power;
  }

  override register(services): void {
    super.register(services);

    services.renderingService.register(this);
    services.updateService.register(this);
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.save();
    renderer.globalCompositeOperation = 'lighter';

    renderer.beginPath();
    renderer.rect((-this.#width * 10) / 2, (-this.#height * 10) / 2, this.#width * 10, this.#height * 10);

    renderer.shadowBlur = 5;
    renderer.shadowColor = `rgb(${this.#color.red}, ${this.#color.green}, ${this.#color.blue})`;
    renderer.strokeStyle = `rgba(${this.#color.red}, ${this.#color.green}, ${this.#color.blue}, ${this.#color.alpha ?? 1})`;
    renderer.lineWidth = 3;
    renderer.stroke();
    renderer.lineWidth = 1;
    renderer.stroke();

    renderer.restore();
  }

  override buildRigidBody(): RigidBody {
    return new RigidBody(new Box(this.#width, this.#height), new Vector2(0, 0), 0, 0.1);
  }

  update(_dt: number): void {
    // this.rigidBody.addForce(new Vector2(0, -10));
  }

  #width: number = 4;
  #height: number = 2;
  #color: Color = { red: 255, green: 255, blue: 255 };
}
