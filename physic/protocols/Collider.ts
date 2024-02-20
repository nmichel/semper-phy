import { NotImplementedError, defprotocol } from '../Protocol';
import { Vector2 } from '../Math.js';

const Collider = defprotocol('Collider', {
  overlap: (_shape: any): { depth: number; normal: Vector2 } | null => {
    throw new NotImplementedError();
  },
  collide: (_shape: any): Vector2[] => {
    throw new NotImplementedError();
  },
});

class CollisionInfo {
  constructor(point: Vector2, normal: Vector2) {
    this.point = point;
    this.normal = normal;
  }

  reverseNormal(): CollisionInfo {
    this.normal.scaleSelf(-1);
    return this;
  }

  point: Vector2;
  normal: Vector2;
}

export { CollisionInfo, Collider };
