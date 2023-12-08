import { GameApp, Renderable, Services, Updatable } from "../engine/gameApp";
import { GameObject } from "../engine/gameObject";

function clamp(what, min, max) {
  return Math.min(max, Math.max(what, min));
}

class BackgroundLayer implements Updatable, Renderable {
  constructor(targetWidth: number, width: number, height: number, speedMs: number, color: string) {
    this.#width = width;
    this.#targetWidth = targetWidth;
    this.#height = height;
    this.#speedMs = speedMs;
    this.#color = color;
    this.#offset = this.#targetWidth;

    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    context.fillStyle = this.#color;
    context.fillRect(0, 0, width, height);
    this.#image = canvas.transferToImageBitmap();
  }

  update(dt: number): void {
    this.#offset -= dt * this.#speedMs;
    if (this.#offset < -this.#width) {
      this.#offset = this.#targetWidth;
    }
  }

  render(renderer: CanvasRenderingContext2D): void {
    const sx = Math.max(0, -this.#offset);
    const sw = Math.min(
      clamp(this.#width + sx, 0, this.#width),
      clamp(this.#targetWidth - this.#offset, 0, this.#targetWidth)
    );
    const dx = Math.max(0, this.#offset);
    renderer.drawImage(this.#image, sx, 0, sw, this.#height, dx, 500 - this.#height, sw, this.#height);
  }

  #speedMs: number;
  #offset: number;
  #height: number;
  #width: number;
  #targetWidth: number;
  #color: string;
  #image: ImageBitmap;
}

export class Background extends GameObject implements Updatable, Renderable {
  constructor(app: GameApp) {
    super(app);

    this.#layers = [
      new BackgroundLayer(500, 1000, 200, 0.001 * 50, 'rgb(0, 0, 120)'),
      new BackgroundLayer(500, 350, 300, 0.001 * 75, 'rgb(120, 120, 0)'),
      new BackgroundLayer(500, 100, 400, 0.001 * 100, 'red'),
    ]
  }

  override register(services: Services): void {
    services.updateService.register(this);
    services.renderingService.register(this);
  }
  
  update(dt: number): void {
    this.#layers.forEach(layer => layer.update(dt));
  }
  
  render(renderer: CanvasRenderingContext2D): void {
    this.#layers.forEach(layer => layer.render(renderer));
  }

  #layers: BackgroundLayer[];
}