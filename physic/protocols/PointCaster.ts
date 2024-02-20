import { NotImplementedError, defprotocol } from '../Protocol';
import { Vector2 } from '../Math.js';

const PointCaster = defprotocol('PointCaster', {
  contains: (_point: Vector2): boolean => {
    throw new NotImplementedError();
  },
});

export { PointCaster };
