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

class Span {
  // constructor(Number, Number) -> Span
  constructor(vmin, vmax) {
    this.vmin = vmin;
    this.vmax = vmax;
  }

  // update(Span, Number) -> Span
  update(v) {
    this.vmin = Math.min(this.vmin, v);
    this.vmax = Math.max(this.vmax, v);
    return this;
  }

  // containsPoint(Span, Number) -> bool
  containsPoint(p) {
    return this.vmin <= p && p <= this.vmax;
  }

  // doesOverlap(Span, Span) -> bool
  doesOverlap(s) {
    return ! (this.vmin > s.vmax || s.vmin > this.vmax);
  }

  // overlap(this: Span, s: Span) -> Number
  // require: doesOverlap(this, s) === true
  overlap(s) {
    const [oMin, oMax] = s.containsPoint(this.vmin) ? [this.vmin, s.vmax] : [s.vmin, this.vmax];
    return oMax - oMin;
  }
}

export { Vector2, Span, clamp };
