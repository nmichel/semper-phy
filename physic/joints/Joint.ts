export abstract class Joint {
  private static idSeed = 0;

  constructor(anchorA, anchorB) {
    this.#id = Joint.idSeed++;
    this.#anchorA = anchorA;
    this.#anchorB = anchorB;
  }

  get id(): number {
    return this.#id;
  }

  get anchorA() {
    return this.#anchorA;
  }

  get anchorB() {
    return this.#anchorB;
  }

  abstract update(): void;

  #id: number;
  #anchorA;
  #anchorB;
}
