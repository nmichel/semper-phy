import { Vector2 } from '../physic/Math';
import { GameObject } from './gameObject';
import { Registry, Service } from './service';

class OutOfBoundService extends Registry<GameObject & { get position(): Vector2 }> implements Service {
  constructor(pred: (_pos: Vector2) => boolean) {
    super();

    this.#pred = pred;
  }

  run(): void {
    this.apply(obj => {
      if (this.#pred(obj.position)) {
        obj.reclaim();
      }
    });
  }

  #pred: (_pos: Vector2) => boolean;
}

export { OutOfBoundService };
