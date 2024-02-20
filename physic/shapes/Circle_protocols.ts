import { defimpl } from '../Protocol';
import {
  Aligner,
  CircleCollider,
  Collider,
  Inertia,
  PointCaster,
  PolygonCollider,
  RayCaster,
  Render,
  Transformer,
} from '../protocols/protocols';
import { Ray, RayIntersection } from '../Ray';
import { Circle } from './Circle';
import * as GfxTools from '../gfx';
import { Vector2 } from '../Math';
import { AABB } from '../AABB';
import { Frame } from '../Frame';
import { Polygon } from './geom';

defimpl(RayCaster, Circle, {
  cast: (circle: Circle, ray: Ray): RayIntersection[] => {
    const radius2 = circle.radius * circle.radius;
    const L = ray.origin.scale(-1);
    const tca = L.dot(ray.direction);
    // if (tca < 0) return false;
    const d2 = L.dot(L) - tca * tca;
    if (d2 > radius2) return [];
    const thc = Math.sqrt(radius2 - d2);
    const t0 = tca - thc;
    const t1 = tca + thc;

    const result: RayIntersection[] = [];
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
  },
});

defimpl(Render, Circle, {
  render: (circle: Circle, ctxt: CanvasRenderingContext2D): undefined => {
    const { x, y } = circle.position;
    GfxTools.drawCircle(ctxt, x, y, circle.radius, { strokeStyle: 'white' });
  },
});

defimpl(Transformer, Circle, {
  toWorld: (circle: Circle, frame: Frame): Circle => {
    return new Circle(circle.radius, frame.positionToWorld(circle.position));
  },
  toLocal: (_obj: Circle, _frame: Frame): Circle => {
    throw new Error('Function not implemented.');
  },
});

defimpl(PointCaster, Circle, {
  contains: (circle: Circle, point: Vector2): boolean => {
    const dist: number = circle.position.sub(point).length();
    return dist <= circle.radius;
  },
});

defimpl(Collider, Circle, {
  overlap: (circle: Circle, shape: any): { depth: number; normal: Vector2 } | null => CircleCollider.overlap(shape, circle),
  collide: (circle: Circle, shape: any): Vector2[] => CircleCollider.collide(shape, circle),
});

defimpl(CircleCollider, Circle, {
  overlap: (a: Circle, b: Circle): { depth: number; normal: Vector2 } | null => {
    const a2b = b.position.sub(a.position);
    const a2bLength = a2b.length();
    const radii = a.radius + b.radius;
    if (a2bLength > radii) {
      return null;
    }

    const depth = radii - a2bLength;
    const normal = a2b.scale(1.0 / a2bLength);

    return { depth, normal };
  },

  collide: (a: Circle, b: Circle): Vector2[] => {
    const a2b = b.position.sub(a.position).normalizeSelf();
    return [a.position.add(a2b.scale(a.radius))];
  },
});

defimpl(PolygonCollider, Circle, {
  overlap: (circle: Circle, polygon: Polygon): { depth: number; normal: Vector2 } | null => CircleCollider.overlap(polygon, circle),
  collide: (circle: Circle, polygon: Polygon): Vector2[] => CircleCollider.collide(polygon, circle),
});

defimpl(Inertia, Circle, {
  compute: ({ radius }: Circle, mass: number) => {
    return (1 / 2) * mass * radius * radius;
  },
});

defimpl(Aligner, Circle, {
  computeAABB: ({ radius }: Circle, frame: Frame): AABB => {
    const position = frame.positionToWorld(Vector2.zero);
    const delta = new Vector2(radius, radius);
    const topLeft = position.sub(delta);
    const bottomRight = position.add(delta);
    const aabbb = new AABB();
    aabbb.update(topLeft).update(bottomRight);
    return aabbb;
  },
});
