import { Vector2 } from "./math.js";

class Circle {
  constructor(radius, position = new Vector2(0, 0)) {
    this.radius = radius;
    this.position = position;
  }
}

export { Circle };
