import { Vector2 } from '../Math';

class Box {
  constructor(width: number, height: number) {
    this.size = new Vector2(width, height);
    this.halfSize = this.size.scale(0.5);
  }

  findNormal(point: Vector2): Vector2 {
    const deltaX = Math.abs(this.halfSize.x - Math.abs(point.x));
    const deltaY = Math.abs(this.halfSize.y - Math.abs(point.y));
    if (deltaX < deltaY) {
      return new Vector2(Math.sign(point.x), 0);
    } else {
      return new Vector2(0, Math.sign(point.y));
    }
  }

  size: Vector2;
  halfSize: Vector2;
}

export { Box };
