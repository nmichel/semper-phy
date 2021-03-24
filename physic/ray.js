import { RayCaster } from './protocols/protocols.js';

class Ray {
  // buildRayFromPoints(Vector2, Vector2) -> Ray
  static buildRayFromPoints(a, b) {
    return new Ray(a, b.sub(a).normalize());
  }

  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  cast(target) {
    return RayCaster.cast(target, this);
  }

  getPointAtCoef(t) {
    return this.origin.add(this.direction.scale(t));
  }
}

class RayIntersection {
  constructor(point, normal, t) {
    this.point = point;
    this.normal = normal;
    this.t = t;
  }
}

export { Ray, RayIntersection }