import { RayCaster, Render } from './protocols.js';
import { Circle } from './circle.js';
import { defimpl } from './functional.js';
import * as GfxTools from './gfx.js';
import { Vector2 } from './math.js';

defimpl(RayCaster, Circle, 'cast', (circle, ray) => {
  const radius2 = circle.radius * circle.radius;
  const L = ray.origin.scale(-1);
  const tca = L.dot(ray.direction); 
  // if (tca < 0) return false;
  const d2 = L.dot(L) - tca * tca; 
  if (d2 > radius2) return []; 
  const thc = Math.sqrt(radius2 - d2); 
  const t0 = tca - thc; 
  const t1 = tca + thc;

  const result = [];
  if (t0 > 0) {
    result.push(ray.getPointAtCoef(t0));
  }
  if (t1 > 0) {
    result.push(ray.getPointAtCoef(t1));
  }
  return result;
});

defimpl(Render, Circle, 'render', (circle, ctxt, {frame}) => {
  const {x, y} = frame.positionToWorld(new Vector2(0, 0));
  GfxTools.drawCircle(ctxt, x, y, circle.radius, 'white');
});
