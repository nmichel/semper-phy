import { Matrix3, Vector2 } from './Math';

class Frame {
  constructor(rotation: number = 0.0, position: Vector2 = new Vector2()) {
    this.#rotation = rotation;
    this.#position = position;

    this.recomputeMatrices();
  }

  get position() {
    return this.#position;
  }

  set position(position: Vector2) {
    this.#position = position;
    this.recomputeMatrices();
  }

  get rotation() {
    return this.#rotation;
  }

  set rotation(rotation: number) {
    this.#rotation = rotation;
    this.recomputeMatrices();
  }

  directionToWorld(v) {
    return this.#l2w.transformDirection(v);
  }

  positionToWorld(v) {
    return this.#l2w.transformPosition(v);
  }

  directionToLocal(v) {
    return this.#w2l.transformDirection(v);
  }

  positionToLocal(v) {
    return this.#w2l.transformPosition(v);
  }

  recomputeMatrices() {
    this.#l2w = Matrix3.newRotation(this.#rotation).mul(Matrix3.newTranslation(this.#position));
    this.#w2l = Matrix3.newTranslation(this.#position.scale(-1.0)).mul(Matrix3.newRotation(-this.#rotation));
  }

  #rotation: number;
  #position: Vector2;
  #l2w: Matrix3;
  #w2l: Matrix3;
}

export { Frame };
