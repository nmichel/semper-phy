import { Vector2 } from '../physic/Math';
import { RigidBody } from '../physic/rigidBody';
import { Scene } from '../physic/scene';
import { GameObject } from './gameObject';
import { Registry, Service } from './service';

type PhysicServiceObject = GameObject & { get rigidBody(): RigidBody };

class PhysicService extends Registry<PhysicServiceObject> implements Service {
  constructor(engine: Scene) {
    super();

    this.#engine = engine;
  }

  run(): void {}

  override register(obj: PhysicServiceObject): void {
    super.register(obj);
    this.#engine.addBody(obj.rigidBody);
  }

  override unregister(id: number): void {
    const obj = this.registry.find(obj => obj.id === id);
    if (obj) {
      this.#engine.removeBody(obj.rigidBody);
    }
    super.unregister(id);
  }

  get engine(): Scene {
    return this.#engine;
  }

  #engine: Scene;
}

export { PhysicService, PhysicServiceObject };
