import { GameApp, Services } from '../engine/gameApp';
import { GameObject } from '../engine/gameObject.js';
import { Renderable } from '../engine/renderingService';
import { Updatable } from '../engine/updateService';

export class ScoreDisplay extends GameObject implements Renderable, Updatable {
  constructor(app: GameApp) {
    super(app);
  }

  addScore(score: number): void {
    this.#score += score;
  }

  override register(services: Services): void {
    services.renderingService.register(this);
    services.updateService.register(this);
  }

  /**
   * From Renderable
   */
  render(renderer: CanvasRenderingContext2D): void {
    const sin: number = Math.sin((this.#angle * 0.1 * Math.PI) / 180);

    const prevTextAlign = renderer.textAlign;
    renderer.textAlign = 'center';
    renderer.translate(700, 50);
    renderer.rotate((sin * 20 * Math.PI) / 180);
    renderer.font = '20px Arial';
    renderer.fillStyle = 'white';
    renderer.fillText(`Score: ${this.#score}`, 0, 0);
    renderer.setTransform(1, 0, 0, 1, 0, 0);
    renderer.textAlign = prevTextAlign;
  }

  /**
   * From Updatable
   */
  update(dt: number): void {
    this.#angle += dt;
  }

  #angle = 0;
  #score: number = 0;
}
