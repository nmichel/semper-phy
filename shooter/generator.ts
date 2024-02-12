import { Vector2 } from '../physic/Math';
import { GameApp, Services } from '../engine/gameApp';
import { GameObject } from '../engine/gameObject';
import { Updatable } from '../engine/updateService';
import { Box } from './box';
import { Shooter } from './shooter';
import { Renderable } from '../engine/renderingService';

export type SpawnFun = (position: Vector2, app: GameApp) => void;

export class Generator extends GameObject implements Updatable, Renderable {
  constructor(app: GameApp, spawnFun: SpawnFun, tickMs: number = 0) {
    super(app);
    this.#spawnFun = spawnFun;
    this.#tickMs = tickMs;
  }

  set position(position: Vector2) {
    this.#position = position.clone();
  }

  override register(services: Services): void {
    services.updateService.register(this);
    services.renderingService.register(this);
  }

  update(dt: number): void {
    this.#time += dt;
    if (this.#time > this.#nextSpawn) {
      this.#time = 0;
      this.#nextSpawn = this.#tickMs > 0 ? this.#tickMs : 50 + Math.random() * 100;
      this.#spawn();
    }
  }

  render(renderer: CanvasRenderingContext2D): void {
    renderer.beginPath();
    renderer.rect(this.#position.x * 10 - 10, this.#position.y * 10 - 10, 20, 20);
    renderer.strokeStyle = 'red';
    renderer.lineWidth = 3;
    renderer.stroke();
  }

  #spawn() {
    this.#spawnFun(this.#position, this.app);
  }

  #spawnFun: SpawnFun;
  #time: number = 0;
  #nextSpawn: number = 0;
  #tickMs: number;
  #position: Vector2 = new Vector2(0, 0);
}
