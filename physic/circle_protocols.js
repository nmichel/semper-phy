import { Aligner, CircleCollider, Collider, PointCaster, PolygonCollider, RayCaster, Render, Transformer } from './protocols/protocols.js';
import { Inertia } from './protocols/inertia.js';
import { RayIntersection } from './ray.js';
import { Circle } from './circle.js';
import { defimpl } from './functional.js';
import * as GfxTools from './gfx.js';
import { Vector2 } from './math.js';
import { AABB } from './aabb.js';

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
    const point = ray.getPointAtCoef(t0);
    const normal = point.normalize();
    const col = new RayIntersection(point, normal, t0);
    result.push(col);
  }
  if (t1 > 0) {
    const point = ray.getPointAtCoef(t1);
    const normal = point.normalize();
    const col = new RayIntersection(point, normal, t1);
    result.push(col);
  }
  return result;
});

defimpl(Render, Circle, 'render', (circle, ctxt) => {
  const {x, y} = circle.position;
  GfxTools.drawCircle(ctxt, x, y, circle.radius, { strokeStyle: 'white' });
});

defimpl(Transformer, Circle, 'toWorld', (circle, frame) => {
  return new Circle(circle.radius, frame.positionToWorld(circle.position));
});

defimpl(PointCaster, Circle, 'contains', (circle, point) => {
  const dist = circle.position.sub(point).length();
  return dist <= circle.radius;
});

defimpl(Collider, Circle, 'overlap', (circle, shape) => CircleCollider.overlap(shape, circle));
defimpl(Collider, Circle, 'collide', (circle, shape) => CircleCollider.collide(shape, circle));

defimpl(CircleCollider, Circle, 'overlap', (a, b) => {
  const a2b = b.position.sub(a.position);
  const a2bLength = a2b.length();
  const radii = a.radius + b.radius;
  if (a2bLength > radii) {
    return null;
  }

  const depth = radii - a2bLength;
  const normal = a2b.scale(1.0 / a2bLength);

  return {depth, normal};
});

defimpl(CircleCollider, Circle, 'collide', (a, b) => {
  const a2b = b.position.sub(a.position).normalizeSelf();
  return [a.position.add(a2b.scale(a.radius))]
});

defimpl(PolygonCollider, Circle, 'overlap', (circle, polygon) => CircleCollider.overlap(polygon, circle));
defimpl(PolygonCollider, Circle, 'collide', (circle, polygon) => CircleCollider.collide(polygon, circle));

defimpl(Inertia, Circle, 'compute', ({ radius }, mass) => {
  return 1/2 * mass * radius * radius;
});

defimpl(Aligner, Circle, 'computeAABB', (circle, frame) => {
  const { radius } = circle;
  const position = frame.positionToWorld(Vector2.zero);
  const delta = new Vector2(radius, radius);
  const topLeft = position.sub(delta);
  const bottomRight = position.add(delta);
  const aabbb = new AABB();
  aabbb
    .update(topLeft)
    .update(bottomRight);
  return aabbb;
});
