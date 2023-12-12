import { Vector2 } from '../physic/math.js';
import { BrowserApp } from "../browser_app";
import { GameObject } from "./gameObject";

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

interface EventHandler {
  handleInputState(_inputState: InputState): void;
}

type InputState = {
  mousePos: Vector2;
  eventDbleClick: boolean;
  eventMouseMove: boolean;
  eventKeyDown: boolean;
  eventKeyUp: boolean;
};

const EVENTS = {
  EVENT_MOUSE_MOVE: 'mouse_move',
  EVENT_DBL_CLICK: 'dbl_click',
  EVENT_KEY_DOWN: 'key_down',
} as const;

class EventService extends Registry<Registrable<EventHandler>> implements Service {
  constructor() {
    super();

    this.#inputState = {
      mousePos: new Vector2(0, 0),
      eventDbleClick: false,
      eventMouseMove: false,
      eventKeyDown: false,
      eventKeyUp: false,
    };
  }

  run(): void {
    if (this.#somethingHappened) {
      this.apply(obj => obj.handleInputState(this.#inputState));
      this.#resetState();
    }
  }

  onMousemove(e) {
    this.#inputState.eventMouseMove = true;
    this.#inputState.mousePos = new Vector2(e.offsetX, e.offsetY);
    this.#somethingHappend();
  } 

  onDblclick(_e) {
    this.#inputState.eventDbleClick = true;
    this.#somethingHappend();
  }

  onKeydown(e) {
    this.#inputState.eventKeyDown = true;
    this.#somethingHappend();
  }

  onKeyup(e) {
    this.#inputState.eventKeyUp = true;
    this.#somethingHappend();
  }

  #somethingHappend() {
    this.#somethingHappened = true;
  }

  #resetState() {
    this.#inputState.eventDbleClick = false;
    this.#inputState.eventMouseMove = false;
    this.#inputState.eventKeyDown = false;
    this.#inputState.eventKeyUp = false;
    this.#somethingHappened = false;
  }

  #inputState: InputState;
  #somethingHappened: boolean = false;
}

type Services = {
  renderingService: RenderingService;
  updateService: UpdateService;
  eventService: EventService;
  [key: string]: any;
}

class GameApp extends BrowserApp implements FrameInfoSource, Service {
  constructor(divElement: HTMLDivElement) {
    super(divElement);

    this.#services = {
      updateService: new UpdateService(this),
      renderingService: new RenderingService(super.context as CanvasRenderingContext2D),
      eventService: new EventService(),
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

  /**
   * From BrowserApp
   */
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
      this.#services.eventService.unregister(obj.id);
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

export { GameApp, Renderable, Updatable, EventHandler, Service, InputState, Services};
