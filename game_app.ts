import { BrowserApp } from "./browser_app";


type HasId = {
  get id(): number;
}

interface Renderable {
  render(_renderer: CanvasRenderingContext2D): void;
}

interface Updatable {
  update(_dt: number): void;
}

interface Service {
  run(): void;
}

type Registrable<T> = T & HasId;

interface FrameInfoSource {
  get dt(): number;
}

class Registry<T> {
  register(obj: Registrable<T>): void {
    this.#registry.push(obj);
  }

  unregister(id: number): void {
    const idx = this.#registry.findIndex(obj => obj.id === id);
    if (idx !== -1) {
      this.#registry.splice(idx, 1);
    }
  }

  apply(fn: (obj: T) => void): void {
    this.#registry.forEach(obj => fn(obj));
  }

  #registry: Registrable<T>[] = [];
}

class UpdateService extends Registry<Registrable<Updatable>> implements Service {
  constructor(frameInfoSource: FrameInfoSource) {
    super();
    this.#frameInfoSource = frameInfoSource;
  }

  run(): void {
    this.apply(updatable => updatable.update(this.#frameInfoSource.dt));
  }

  #frameInfoSource: FrameInfoSource;
}

class RenderingService extends Registry<Registrable<Renderable>> implements Service {
  constructor(renderer: CanvasRenderingContext2D) {
    super();
    this.#renderer = renderer;
  }

  run(): void {
    this.apply(renderable => renderable.render(this.#renderer));
  }

  #renderer: CanvasRenderingContext2D;
}

type Services = {
  renderingService: RenderingService;
  updateService: UpdateService;
  [key: string]: any;
}

class GameObject {
  constructor(app: GameApp) {
    this.#app = app;
  
    app.register(this);
  }

  register(services: Services): void {
    throw new Error("Method not implemented.");
  }

  get id(): number {
    return this.#id;
  }

  get app(): GameApp {
    return this.#app;
  }

  reclaim(): void {
    this.#app.reclaim(this);
  }

  #id: number = Math.random() * 10000000000;
  #app: GameApp;
}

class GameApp extends BrowserApp implements FrameInfoSource, Service {
  constructor(divElement: HTMLDivElement) {
    super(divElement);

    this.#services = {
      updateService: new UpdateService(this),
      renderingService: new RenderingService(super.context as CanvasRenderingContext2D),
      self: this
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
    this.#collectReclaimed();
  }

  register(obj: GameObject): void {
    obj.register(this.#services);
  }

  reclaim(obj: GameObject): void {
    this.#reclaimables.push(obj);
  }

  get services(): Services {
    return this.#services;
  }

  get stats(): any {
    return {
      ...this.#stats,
      reclaimablesCount: this.#reclaimables.length
    }
  }

  #collectReclaimed() {
    this.#stats.reclaimabledInLastFrameCount = this.#reclaimables.length;
    this.#stats.reclaimabledTotalCount += this.#reclaimables.length;

    this.#reclaimables.forEach(obj => {
      this.#services.renderingService.unregister(obj.id);
      this.#services.updateService.unregister(obj.id);
    });
    this.#reclaimables = [];
  }

  #dt: number = 0;
  #stats: any = {
    reclaimabledInLastFrameCount: 0,
    reclaimabledTotalCount: 0,
    lastFrameDuration: 0,
  };
  #services: Services;
  #reclaimables: GameObject[] = [];
}

export { GameApp, GameObject, Renderable, Updatable, Service, Services};
