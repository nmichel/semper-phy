import { defimpl } from './functional.js';
import { Ray, RayIntersection } from './ray.js';
import { Cloner, Render, Transformer } from './protocols/protocols.js';
import * as GfxTools from './gfx.js';
import { Vector2 } from './math.js';

defimpl(Render, Ray, 'render', (ray, ctxt, opts) => {
  GfxTools.drawLine(ctxt, ray.origin.sub(ray.direction.scale(1000)), ray.origin.add(ray.direction.scale(2000)), {strokeStyle: 'yellow', lineDash: [5, 5]});
  GfxTools.drawVector(ctxt, ray.origin, ray.origin.add(ray.direction.scale(100)), { strokeStyle: 'yellow' });
  GfxTools.drawDisc(ctxt, ray.origin.x, ray.origin.y, 2, { strokeStyle: 'yellow' });
});

defimpl(Transformer, Ray, 'toLocal', (ray, frame) => {
  return new Ray(frame.positionToLocal(ray.origin), frame.directionToLocal(ray.direction));
});

defimpl(Cloner, Ray, 'clone', (ray) => {
  return new Ray(new Vector2(ray.origin.x, ray.origin.y), new Vector2(ray.direction.x, ray.direction.y));
});

defimpl(Render, RayIntersection, 'render', (collision, ctxt, opts) => {
  GfxTools.drawVector(ctxt, collision.point, collision.point.add(collision.normal.scale(30)), { strokeStyle: 'blue' });
  GfxTools.drawDisc(ctxt, collision.point.x, collision.point.y, 3, { strokeStyle: 'orange' });
});

defimpl(Transformer, RayIntersection, 'toWorld', (collision, frame) => {
  return new RayIntersection(frame.positionToWorld(collision.point), frame.directionToWorld(collision.normal), collision.t);
});

defimpl(Cloner, RayIntersection, 'clone', ({ point, normal, t }) => {
  return new RayIntersection(new Vector2(point.x, point.y), new Vector2(normal.x, normal.y), t);
});
