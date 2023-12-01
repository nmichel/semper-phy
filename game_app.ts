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
}

class GameObject {
  constructor(app: GameApp) {
    this.#app = app;
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

class GameApp extends BrowserApp implements FrameInfoSource {
  constructor(divElement: HTMLDivElement) {
    super(divElement);

    this.#services = {
      renderingService: new RenderingService(this.context as CanvasRenderingContext2D),
      updateService: new UpdateService(this)
    };
  }

  get dt(): number {
    return this.#dt;
  }

  render(dt: number): void {
    this.#dt = dt;
    for (const iterator in this.#services) {
      this.#services[iterator].run();
    }
    this.#collectReclaimed();
  }

  get services(): Services {
    return this.#services;
  }

  reclaim(obj: GameObject): void {
    this.#reclaimables.push(obj);
  }

  get stats(): any {
    return {
      reclaimablesCount: this.#reclaimables.length
    }
  }

  #collectReclaimed() {
    this.#reclaimables.forEach(obj => {
      this.#services.renderingService.unregister(obj.id);
      this.#services.updateService.unregister(obj.id);
    });
    this.#reclaimables = [];
  }

  #dt: number = 0;
  #services: Services;
  #reclaimables: GameObject[] = [];
}

export { GameApp, GameObject, Renderable, Updatable, Service, Services };
