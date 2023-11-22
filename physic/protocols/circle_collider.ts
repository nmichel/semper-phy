import { Circle } from '../circle.js';
import { defprotocol, NotImplementedError } from '../functional.js';
import { Vector2 } from '../math.js';

const CircleCollider = defprotocol('CircleCollider', {
  overlap: (_shape: Circle): {depth: number, normal: Vector2} | null => { throw new NotImplementedError },
  collide: (_shape: Circle): Vector2[] => { throw new NotImplementedError }
});

export { CircleCollider };
