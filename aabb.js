import { Vector2 } from './math.js';

class AABB {
  constructor(width, height) {
    this.size = new Vector2(width, height);
    this.halfSize = this.size.scale(0.5);
  }

  // findNormal(AABB, Vector2) -> Vector2
  findNormal(point) {
    const deltaX = Math.abs(this.halfSize.x - Math.abs(point.x));
    const deltaY = Math.abs(this.halfSize.y - Math.abs(point.y));
    if (deltaX < deltaY) {
      return new Vector2(Math.sign(point.x), 0);
    }
    else {
      return new Vector2(0, Math.sign(point.y));
    }
  }
}

export { AABB };
