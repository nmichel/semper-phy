import { NotImplementedError, defprotocol } from '../functional.js';
import { Vector2 } from '../math.js';

const PointCaster = defprotocol('PointCaster', {
  contains: (_point: Vector2): boolean => { throw new NotImplementedError(); }
});
  
export { PointCaster };
