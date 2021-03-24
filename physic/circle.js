import { Span, Vector2 } from "./math.js";

class Circle {
  constructor(radius, position = new Vector2(0, 0)) {
    this.radius = radius;
    this.position = position;
  }

  // computeProjectionSpan(Circle, Vector2) -> Span
  computeProjectionSpan(normal) {
    const centerProj = this.position.dot(normal)
    return new Span(centerProj - this.radius, centerProj + this.radius)
  }
}

export { Circle };
