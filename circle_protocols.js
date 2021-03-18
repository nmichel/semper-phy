import { CircleCollider, Collider, CollisionInfo, PointCaster, PolygonCollider, RayCaster, Render, Transformer } from './protocols/protocols.js';
import { Inertia } from './protocols/inertia.js';
import { RayIntersection } from './ray.js';
import { Circle } from './circle.js';
import { defimpl } from './functional.js';
import * as GfxTools from './gfx.js';

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

defimpl(Collider, Circle, 'collide', (circle, shape) => CircleCollider.collide(shape, circle));

defimpl(CircleCollider, Circle, 'collide', (a, b) => {
  const a2b = b.position.sub(a.position);
  const a2bLength = a2b.length();
  const radii = a.radius + b.radius;
  if (a2bLength > radii) {
    return [];
  }

  const mag = radii - a2bLength;
  a2bLength
  const normal = a2b.scale(1.0 / a2bLength);

  return [new CollisionInfo(a.position.add(a2b.scale(0.5)), normal, mag)];
});

defimpl(PolygonCollider, Circle, 'collide', (circle, polygon) => CircleCollider.collide(polygon, circle));

defimpl(Inertia, Circle, 'compute', ({ radius }, mass) => {
  return 1/2 * mass * radius * radius;
});
