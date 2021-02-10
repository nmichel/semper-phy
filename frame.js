import { Matrix3, Vector2 } from './math.js';

class Frame {
  constructor(rotation = 0.0, position = new Vector2()) {
    this.rotation = rotation;
    this.position = position;
    this.l2w = null;
    this.w2l = null;

    this.recomputeMatrices();
  }

  setPosition(position) {
    this.position = position;
    this.recomputeMatrices();
  }

  directionToWorld(v) {
    return this.l2w.transformDirection(v);
  }

  positionToWorld(v) {
    return this.l2w.transformPosition(v);
  }

  directionToLocal(v) {
    return this.w2l.transformDirection(v);
  }

  positionToLocal(v) {
    return this.w2l.transformPosition(v);
  }

  recomputeMatrices() {
    this.l2w = Matrix3.newRotation(this.rotation).mul(Matrix3.newTranslation(this.position));
    this.w2l = Matrix3.newTranslation(this.position.scale(-1.0)).mul(Matrix3.newRotation(-this.rotation));
  }
}

export { Frame };
