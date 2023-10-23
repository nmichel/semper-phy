import { defprotocol } from '../functional.js';

const Collider = defprotocol('Collider', ['overlap', 'collide']);

class CollisionInfo {
  // constructor(Vector2, Vector2) -> CollisionInfo
  constructor(point, normal) {
    this.point = point
    this.normal = normal
  }

  reverseNormal() {
    this.normal.scaleSelf(-1);
  }
}
  
export { CollisionInfo, Collider };
