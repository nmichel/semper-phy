import { GameApp, Services } from '../engine/gameApp';
import { GameObject } from '../engine/gameObject';
import { Renderable } from '../engine/renderingService';
import { Updatable } from '../engine/updateService';

function clamp(what, min, max) {
  return Math.min(max, Math.max(what, min));
}

class BackgroundBlock implements Renderable {
  constructor(owner: BackgroundLayer, width: number, height: number, color: string, startY: number, endY: number) {
    this.#owner = owner;
    this.#width = width;
    this.#targetWidth = owner.width;
    this.#height = height;
    this.#color = color;
    this.#offset = 0;

    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    const lineWidth = 10;
    const localZero = this.#height * Math.random();

    // Fill background
    context.beginPath();
    context.moveTo(0, this.#height);
    context.lineTo(0, startY);
    context.bezierCurveTo(this.#width / 4, startY, this.#width / 4, localZero, this.#width / 2, localZero);
    context.bezierCurveTo((3 * this.#width) / 4, localZero, (3 * this.#width) / 4, endY, this.#width, endY);
    context.lineTo(this.#width, this.#height);

    context.globalCompositeOperation = 'source-over';
    context.fillStyle = this.#color;
    context.fill();

    // Draw bezier curve
    context.beginPath();
    context.lineTo(0, startY);
    context.bezierCurveTo(this.#width / 4, startY, this.#width / 4, localZero, this.#width / 2, localZero);
    context.bezierCurveTo((3 * this.#width) / 4, localZero, (3 * this.#width) / 4, endY, this.#width, endY);

    context.globalCompositeOperation = 'lighter';
    context.shadowBlur = 10;
    context.lineCap = 'round';
    context.lineWidth = lineWidth;
    context.strokeStyle = this.#color;
    context.stroke();

    context.lineWidth = 4;
    context.stroke();

    context.lineWidth = 1;
    context.stroke();

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
    const sw = Math.min(clamp(this.#width + sx, 0, this.#width), clamp(this.#targetWidth - this.#offset, 0, this.#targetWidth));
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
  constructor(app: GameApp, width: number, blockWidth: number, height: number, speedMs: number, color: string) {
    super(app);

    this.#width = width;
    this.#speedMs = speedMs;

    const blockCount = Math.ceil(width / blockWidth) + 1;
    const ys = [height - Math.random() * height];
    for (let i = 0; i < blockCount; i++) {
      const startY = ys[i];
      ys.push(height - Math.random() * height);
      const endY = ys[(i + 1) % blockCount];
      const block = new BackgroundBlock(this, blockWidth, height, color, startY, endY);
      this.#push(block);
    }
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
    this.#push(ejected);
  }

  #push(block: BackgroundBlock): this {
    const [last] = this.#blocks.slice(-1);
    block.offset = last ? last.offset + last.width : 0;
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
      new BackgroundLayer(app, 800, 700, 200, 0.001 * 50, 'rgb(0, 0, 60)'),
      new BackgroundLayer(app, 800, 350, 150, 0.001 * 75, 'rgb(0, 0, 80)'),
      new BackgroundLayer(app, 800, 100, 100, 0.001 * 100, 'rgb(0, 0, 100)'),
    ];
  }

  override register(services: Services): void {}

  override reclaim(): void {
    this.#layers.forEach(layer => layer.reclaim());
    super.reclaim();
  }

  #layers: BackgroundLayer[];
}
