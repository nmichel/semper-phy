import { Vector2 } from './math.js';

class AABB {
  constructor(width, height) {
    this.size = new Vector2(width, height);
    this.halfSize = this.size.scale(0.5);
  }
}

export { AABB };
