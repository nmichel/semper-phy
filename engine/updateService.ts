import { Registrable, Registry, Service } from "./service";

interface Updatable {
  update(_dt: number): void;
}

interface FrameInfoSource {
  get dt(): number;
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

export { UpdateService, Updatable, FrameInfoSource }