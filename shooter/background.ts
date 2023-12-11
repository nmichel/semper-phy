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

    context.globalCompositeOperation = "lighter";
    context.shadowBlur = 10;
  
    const gradient = context.createLinearGradient(0, 0, this.#width, 0);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(0.5, this.#color);
    gradient.addColorStop(1.0, "black");

    const lineWidth = 10;
    const baseY = this.#height - lineWidth;

    context.beginPath();
    context.moveTo(0, baseY);
    context.bezierCurveTo(this.#width / 4, baseY, this.#width / 4, 0, this.#width / 2, 10);
    context.bezierCurveTo(3 * this.#width / 4, 10, 3 * this.#width / 4, baseY, this.#width, baseY);

    context.fillStyle = gradient;
    context.lineWidth = lineWidth;
    context.strokeStyle = this.#color;
    context.stroke();

    context.lineWidth = 4;
    context.stroke();

    context.lineWidth = 1;
    context.stroke();

    context.fill();
  
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
    renderer.drawImage(this.#image, sx, 0, sw, this.#height, dx + 10, 450 - this.#height, sw, this.#height);
  }

  #owner: BackgroundLayer;
  #offset: number;
  #height: number;
  #width: number;
  #targetWidth: number;
  #color: string;
  #image: ImageBitmap;
}

class BackgroundLayer extends GameObject implements Updatable, Renderable {
  constructor(app: GameApp, width: number, speedMs: number) {
    super(app);
  
    this.#width = width;
    this.#speedMs = speedMs;
  }

  update(dt: number): void {
    this.#blocks.forEach(block => block.move(dt * this.#speedMs));
  }

  render(renderer: CanvasRenderingContext2D): void {
    this.#blocks.forEach(block => block.render(renderer));
  }

  override register(services: Services): void {
    services.updateService.register(this);
    services.renderingService.register(this);
  }

  reject(): void {
    const [ejected] = this.#blocks.splice(0, 1);
    this.push(ejected);
  }

  push(block: BackgroundBlock): this {
    const [last] = this.#blocks.slice(-1);
    block.offset = Math.max(last ? last.offset + last.width : this.#width, this.#width);
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

export class Background extends GameObject {
  constructor(app: GameApp) {
    super(app);

    this.#layers = [
      new BackgroundLayer(app, 800, 0.001 * 50),
      new BackgroundLayer(app, 800, 0.001 * 75),
      new BackgroundLayer(app, 800, 0.001 * 100),
    ]

    this.#layers[0]
      .push(new BackgroundBlock(this.#layers[0], 1000, 200, 'rgb(0, 0, 120)'))
      .push(new BackgroundBlock(this.#layers[0], 1000, 250, 'rgb(0, 0, 110)'))
      .push(new BackgroundBlock(this.#layers[0], 1000, 275, 'rgb(0, 0, 140)'));
    this.#layers[1]
      .push(new BackgroundBlock(this.#layers[1], 350, 300, 'rgba(120, 120, 0, 0.5)'));
    this.#layers[2]
      .push(new BackgroundBlock(this.#layers[2], 100, 350, 'rgba(120, 0, 0, 0.5)'))
      .push(new BackgroundBlock(this.#layers[2], 100, 350, 'rgba(120, 0, 0, 0.5)'))
      .push(new BackgroundBlock(this.#layers[2], 100, 350, 'rgba(120, 0, 0, 0.5)'))
      .push(new BackgroundBlock(this.#layers[2], 100, 350, 'rgba(120, 0, 0, 0.5)'))
  }

  override register(services: Services): void {}

  override reclaim(): void {
    this.#layers.forEach(layer => layer.reclaim());
    super.reclaim();
  }

  #layers: BackgroundLayer[];
}