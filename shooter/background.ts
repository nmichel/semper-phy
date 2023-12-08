import { GameApp, Renderable, Services, Updatable } from "../engine/gameApp";
import { GameObject } from "../engine/gameObject";

function clamp(what, min, max) {
  return Math.min(max, Math.max(what, min));
}

class BackgroundBlock implements Renderable {
  constructor(owner: BackgroundLayer, width: number, height: number, color: string, trail: number = 0) {
    this.#owner = owner;
    this.#width = width + trail;
    this.#targetWidth = owner.width;
    this.#height = height;
    this.#color = color;
    this.#offset = 0;

    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    context.fillStyle = this.#color;
    context.fillRect(0, 0, width, height);    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(width, 0, trail, height);
    this.#image = canvas.transferToImageBitmap();
  }

  get width(): number {
    return this.#width;
  }

  get offset(): number {
    return this.#offset;
  }

  set offset(offset: number) {
    this.#offset = offset;
  }

  move(offsetDx: number): void {
    this.#offset -= offsetDx;
    if (this.#offset > this.#targetWidth) {
      return; // out of screen on the right
    }
  
    if (this.#offset < -this.#width) {
      this.#owner.reject(); // out of screen on the left
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

  #owner: BackgroundLayer;
  #offset: number;
  #height: number;
  #width: number;
  #targetWidth: number;
  #color: string;
  #image: ImageBitmap;
}

class BackgroundLayer implements Updatable, Renderable {
  constructor(width: number, speedMs: number) {
    this.#width = width;
    this.#speedMs = speedMs;
  }

  update(dt: number): void {
    this.#blocks.forEach(block => block.move(dt * this.#speedMs));
  }

  render(renderer: CanvasRenderingContext2D): void {
    this.#blocks.forEach(block => block.render(renderer));
  }

  reject(): void {
    const [ejected] = this.#blocks.splice(0, 1);
    this.push(ejected);
  }

  push(block: BackgroundBlock): this {
    const [last] = this.#blocks.slice(-1);
    block.offset = last ? last.offset + last.width : this.#width;
    this.#blocks.push(block);
    return this;
  }

  get width(): number {
    return this.#width;
  }

  #speedMs: number;
  #width: number;
  #blocks: BackgroundBlock[] = [];
}

export class Background extends GameObject implements Updatable, Renderable {
  constructor(app: GameApp) {
    super(app);

    this.#layers = [
      new BackgroundLayer(500, 0.001 * 50),
      new BackgroundLayer(500, 0.001 * 75),
      new BackgroundLayer(500, 0.001 * 100),
    ]

    this.#layers[0]
      .push(new BackgroundBlock(this.#layers[0], 1000, 200, 'rgb(0, 0, 120)'))
      .push(new BackgroundBlock(this.#layers[0], 1000, 250, 'rgb(0, 0, 110)'))
      .push(new BackgroundBlock(this.#layers[0], 1000, 275, 'rgb(0, 0, 140)'));
    this.#layers[1].push(new BackgroundBlock(this.#layers[1], 350, 300, 'rgb(120, 120, 0)'));
    this.#layers[2]
      .push(new BackgroundBlock(this.#layers[2], 100, 400, 'red', 100))
      .push(new BackgroundBlock(this.#layers[2], 100, 400, 'red', 200))
      .push(new BackgroundBlock(this.#layers[2], 100, 400, 'red', 150))
      .push(new BackgroundBlock(this.#layers[2], 100, 400, 'red', 100))
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