function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function toRadians(deg) {
  return deg * Math.PI / 180;
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

  crossCoef({x, y}) {
    return this.x * y - x * this.y;
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  normalize() {
    return this.scale(1.0 / this.length());
  }

  normalizeSelf() {
    this.scaleSelf(1.0 / this.length());
    return this;
  }

  // rotateAround(Vector2, Number, Vector2)
  rotateAround(angleInDeg, center) {
    const { x, y } = this.sub(center);

    const cos = Math.cos(toRadians(angleInDeg));
    const sin = Math.sin(toRadians(angleInDeg));

    const rX = (x * cos) - (y * sin);
    const rY = (x * sin) + (y * cos);

    return new Vector2(center.x + rX, center.y + rY);
  }
}

class Matrix3 {
  static newRotation(angleDeg) {
    const angleRad = toRadians(angleDeg);
    return new Matrix3([
      [Math.cos(angleRad), -Math.sin(angleRad), 0],
      [Math.sin(angleRad), Math.cos(angleRad), 0],
      [0, 0, 1]
    ]);
  }

  static newTranslation(position) {
    return new Matrix3([
      [1, 0, position.x],
      [0, 1, position.y],
      [0, 0, 1]
    ]);
  }

  constructor(rows) {
    this.rows = rows;
  }

  mul(o) {
    const coefs = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]

    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        for (let k = 0; k < 3; k++)
          coefs[i][j] += o.rows[i][k] * this.rows[k][j];
      }
    }
    return new Matrix3(coefs);
  }

  transformDirection({x, y}) {
    return new Vector2(
      this.rows[0][0] * x + this.rows[0][1] * y,
      this.rows[1][0] * x + this.rows[1][1] * y)
  }

  transformPosition({x, y}) {
    return new Vector2(
      this.rows[0][0] * x + this.rows[0][1] * y + this.rows[0][2],
      this.rows[1][0] * x + this.rows[1][1] * y + this.rows[1][2]);
  }
};

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

// segmentIntersection(Vector2, Vector2, Vector2, Vector2) -> null | [Number, Number]
// explanation : https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
// borrowed : https://github.com/pgkelley4/line-segments-intersect/blob/master/js/line-segments-intersect.js
function segmentIntersection(p, p2, q, q2) {
  const r = p2.sub(p);
  const s = q2.sub(q);

	var uNumerator = q.sub(p).crossCoef(r);
	var denominator = r.crossCoef(s);

	if (denominator == 0) {
		// lines are parallel or colinear
		return null;
	}

	var u = uNumerator / denominator;
	var t = q.sub(p).crossCoef(s) / denominator;

	return [t, u];
}

export { Matrix3, Span, Vector2, clamp, segmentIntersection };
