import { RigidBody } from './acceleration_structures/AccelerationStructure';
import { Vector2 } from './math';

export class Anchor {
  static idSeed = 0;

  constructor(body: RigidBody, position: Vector2) {
    this.#body = body;
    this.#position = position.clone();
  }

  get id(): number {
    return this.#id;
  }

  get rigidbody(): RigidBody {
    return this.#body;
  }

  get position(): Vector2 {
    return this.#position;
  }

  #id: number = Anchor.idSeed++;
  #body: RigidBody;
  #position: Vector2;
}
