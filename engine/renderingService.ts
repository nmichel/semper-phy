import { Registrable, Registry, Service } from './service';

interface Renderable {
  render(_renderer: CanvasRenderingContext2D): void;
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

export { RenderingService, Renderable };
