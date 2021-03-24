import { defprotocol } from '../functional.js';

const Collider = defprotocol('Collider', ['collide']);

class CollisionInfo {
  // constructor(Vector2, Vector2, Number) -> CollisionInfo
  constructor(point, normal, magnitude) {
    this.point = point
    this.normal = normal
    this.magnitude = magnitude
  }
}
  
export { CollisionInfo, Collider };
