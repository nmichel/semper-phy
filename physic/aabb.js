
import { Vector2 } from "./math.js";

class AABB {
  min = new Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
  max = new Vector2(Number.MIN_VALUE, Number.MIN_VALUE);

  update(point) {
    this.min.x = Math.min(this.min.x, point.x);
    this.min.y = Math.min(this.min.y, point.y);
    this.max.x = Math.max(this.max.x, point.x);
    this.max.y = Math.max(this.max.y, point.y);
    return this;
  }
}

export { AABB }
