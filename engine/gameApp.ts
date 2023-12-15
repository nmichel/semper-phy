import { Vector2 } from '../physic/math.js';
import { BrowserApp } from '../browser_app';
import { GameObject } from './gameObject';
import { Service } from './service.js';
import { EventService } from './eventService.js';
import { FrameInfoSource, UpdateService } from './updateService.js';
import { RenderingService } from './renderingService.js';

type Services = {
  renderingService: RenderingService;
  updateService: UpdateService;
  eventService: EventService;
  [key: string]: any;
};

abstract class GameApp extends BrowserApp implements FrameInfoSource, Service {
  constructor(divElement: HTMLDivElement) {
    super(divElement);

    this.#services = {
      updateService: new UpdateService(this),
      renderingService: new RenderingService(super.context as CanvasRenderingContext2D),
      eventService: new EventService(),
      self: this,
    };
  }

  /**
   * From BrowserApp
   *
   * @param dt the time elapsed since the last frame in milliseconds
   */
  override render(dt: number): void {
    this.#dt = dt;
    this.#stats.lastFrameDuration = dt;
    for (const iterator in this.#services) {
      this.#services[iterator].run();
    }
  }

  /**
   * From FrameInfoSource
   *
   * @returns the time elapsed since the last frame in milliseconds
   */
  get dt(): number {
    return this.#dt;
  }

  /**
   * From Service
   */
  run(): void {
    this.#collectReclaimedObjects();
    this.#injectPendingObjects();
  }

  /**
   * From BrowserApp
   */
  override onMousedown(e) {
    this.#services.eventService.onMouseDown(e);
  }

  override onMouseup(e) {
    this.#services.eventService.onMouseUp(e);
  }

  override onDblclick(e) {
    this.#services.eventService.onDblclick(e);
  }

  override onMousemove(e) {
    this.#services.eventService.onMousemove(e);
  }

  override onKeydown(e) {
    this.#services.eventService.onKeydown(e);
  }

  register(obj: GameObject): void {
    obj.register(this.#services);
  }

  reclaim(obj: GameObject): void {
    this.#reclaimables.push(obj);
  }

  addGameObject(obj: GameObject): void {
    this.#pendingObjects.push(obj);
  }

  abstract isOffLimits(position: Vector2): boolean;

  get services(): Services {
    return this.#services;
  }

  get stats(): any {
    return {
      ...this.#stats,
      reclaimablesCount: this.#reclaimables.length,
    };
  }

  #collectReclaimedObjects() {
    this.#stats.reclaimabledInLastFrameCount = this.#reclaimables.length;
    this.#stats.reclaimabledTotalCount += this.#reclaimables.length;

    this.#reclaimables.forEach(obj => {
      this.#services.renderingService.unregister(obj.id);
      this.#services.updateService.unregister(obj.id);
      this.#services.eventService.unregister(obj.id);
    });
    this.#reclaimables = [];
  }

  #injectPendingObjects() {
    this.#pendingObjects.forEach(obj => {
      this.register(obj);
    });
    this.#pendingObjects = [];
  }

  #dt: number = 0;
  #stats: any = {
    reclaimabledInLastFrameCount: 0,
    reclaimabledTotalCount: 0,
    lastFrameDuration: 0,
  };
  #services: Services;
  #reclaimables: GameObject[] = [];
  #pendingObjects: GameObject[] = [];
}

export { GameApp, Services };
