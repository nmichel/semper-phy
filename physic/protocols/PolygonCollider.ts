import { NotImplementedError, defprotocol } from '../Protocol';
import { Polygon } from '../shapes/Polygon.js';
import { Vector2 } from '../Math.js';

const PolygonCollider = defprotocol('PolygonCollider', {
  overlap: (_shape: Polygon): { depth: number; normal: Vector2 } | null => {
    throw new NotImplementedError();
  },
  collide: (_shape: Polygon): Vector2[] => {
    throw new NotImplementedError();
  },
});

export { PolygonCollider };
