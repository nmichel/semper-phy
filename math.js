function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

class Vector2 {
  constructor(x = 0.0, y = 0.0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  add({x, y}) {
    return new Vector2(this.x + x, this.y + y);
  }

  addToSelf({x, y}) {
    this.x += x;
    this.y += y;
    return this;
  }

  sub({x, y}) {
    return new Vector2(this.x - x, this.y - y);
  }

  subToSelf({x, y}) {
    this.x -= x;
    this.y -= y;
    return this;
  }

  scale(f) {
    return new Vector2(this.x * f, this.y * f);
  }

  scaleSelf(f) {
    this.x *= f;
    this.y *= f;
    return this;
  }

  dot({x, y}) {
    return this.x * x + this.y * y;
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  normalizeSelf() {
    this.scaleSelf(1.0 / this.length());
    return this;
  }
}

export { Vector2, clamp };
