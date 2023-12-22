import { Vector2 } from '../physic/math';
import { GameApp, Services } from '../engine/gameApp';
import { GameObject } from '../engine/gameObject';
import { Renderable } from '../engine/renderingService';
import { Updatable } from '../engine/updateService';

class Explosion extends GameObject implements Renderable, Updatable {
  constructor(app: GameApp) {
    super(app);
  }

  override register(services: Services): void {
    services.renderingService.register(this);
    services.updateService.register(this);
  }

  update(dt: number): void {
    this.#ttl -= dt;
    if (this.#ttl < 0) {
      this.reclaim();
    }
  }

  render(renderer: CanvasRenderingContext2D): void {
    const ratio = this.#ttl / Explosion.#MAX_TTL;
    const invRatio = 1 - ratio;
    const radius = 10 + (50 - ratio * 50);
    const intensity = Math.sin((ratio * Math.PI) / 2);

    renderer.translate(this.#position.x, this.#position.y);
    renderer.rotate((ratio * Math.PI) / 2);
    renderer.strokeStyle = `rgba(255, 0, 0, ${intensity})`;
    renderer.lineWidth = 2;
    renderer.beginPath();
    // renderer.rect(-radius, -radius, 2*radius, 2*radius);
    renderer.arc(0, 0, radius, 0, 2 * Math.PI);
    renderer.stroke();
    // renderer.fillStyle = `rgb(${Math.ceil(intensity * 255)}, ${Math.ceil(intensity * 127)}, 0)`;
    // renderer.fillRect(-radius, -radius, 2*radius, 2*radius);
    renderer.setTransform(1, 0, 0, 1, 0, 0);
  }

  set position(position: Vector2) {
    this.#position = position.clone();
  }

  #position: Vector2 = new Vector2(0, 0);
  #ttl: number = Explosion.#MAX_TTL;

  static readonly #MAX_TTL = 2000;
}

export { Explosion };
