import { Span, Vector2 } from './Math';

class Circle {
  constructor(radius: number, position: Vector2 = new Vector2(0, 0)) {
    this.radius = radius;
    this.position = position;
  }

  computeProjectionSpan(normal: Vector2): Span {
    const centerProj = this.position.dot(normal);
    return new Span(centerProj - this.radius, centerProj + this.radius);
  }

  radius: number;
  position: Vector2;
}

export { Circle };
