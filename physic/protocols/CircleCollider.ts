import { Circle } from '../shapes/Circle.js';
import { defprotocol, NotImplementedError } from '../Protocol';
import { Vector2 } from '../Math.js';

const CircleCollider = defprotocol('CircleCollider', {
  overlap: (_shape: Circle): { depth: number; normal: Vector2 } | null => {
    throw new NotImplementedError();
  },
  collide: (_shape: Circle): Vector2[] => {
    throw new NotImplementedError();
  },
});

export { CircleCollider };
