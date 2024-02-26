import { Vector2 } from './math';

export class Anchor {
  static idSeed = 0;

  constructor(position) {
    this.#position = position.clone();
  }

  get id(): number {
    return this.#id;
  }

  get position(): Vector2 {
    return this.#position;
  }

  #id: number = Anchor.idSeed++;
  #position: Vector2;
}
