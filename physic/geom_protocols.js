import { Inertia } from './protocols/inertia.js';
import { defimpl } from './functional.js';
import { Edge, Polygon, Vertex } from './geom.js';
import { RayIntersection } from './ray.js';
import { CollisionInfo } from './protocols/protocols.js';
import { Aligner, CircleCollider, Cloner, Collider, PointCaster, PolygonCollider, RayCaster, Render, Transformer } from './protocols/protocols.js';
import { segmentIntersection, Vector2 } from './math.js';
import { AABB } from './aabb.js';
import * as GfxTools from './gfx.js';

defimpl(Render, Vertex, 'render', (vertex, ctxt, opts) => {
  const { x, y } = vertex;
  GfxTools.drawDisc(ctxt, x, y, 5, { strokeStyle: 'red' });
});

defimpl(Render, Edge, 'render', (edge, ctxt, opts) => {
  const { a, b, normal } = edge;
  const d = b.sub(a);
  const m = d.scale(0.5).add(a);
  const offset = normal.scale(20.0);
  
  GfxTools.drawVector(ctxt, m, m.add(normal.scale(15.0)), { strokeStyle: 'red' });
  GfxTools.drawVector(ctxt, m.sub(d.scale(0.4)).add(offset), m.add(d.scale(0.4)).add(offset), { strokeStyle: 'yellow' });
});

defimpl(Render, Polygon, 'render', (polygon, ctxt, opts) => {
  const { debug = false, color = 'white' } = opts;

  GfxTools.drawPolygon(ctxt, polygon.vertices, { strokeStyle: color });
  if (debug) {
    polygon.vertices.forEach(v => Render.render(v, ctxt, opts));
    polygon.edges.forEach(e => Render.render(e, ctxt, opts));
  }
});

defimpl(Transformer, Polygon, 'toWorld', (polygon, frame) => {
  return new Polygon(polygon.vertices.map(v => frame.positionToWorld(v)));
});

defimpl(RayCaster, Polygon, 'cast', (polygon, ray) => {
  const p = ray.origin;
  const p2 = ray.origin.add(ray.direction);

  return polygon.edges.reduce((acc, edge) => {
    const q = edge.a;
    const q2 = edge.b;
    const r = segmentIntersection(p, p2, q, q2);
    if (r) {
      const [t, u] = r;
      if (t >= 0 && u >= 0 && u <= 1) {
        const point = ray.getPointAtCoef(t);
        const normal = edge.normal;
        const col = new RayIntersection(point, normal, t);
        acc.push(col);
      }
    }
    return acc;
  }, []);
});

defimpl(PointCaster, Polygon, 'contains', (polygon, point) => {
  return !polygon.edges.find(({ a, b }) => Math.sign(b.sub(a).crossCoef(point.sub(a))) < 0);
});

defimpl(Collider, Polygon, 'overlap', (polygon, shape) => PolygonCollider.overlap(shape, polygon));
defimpl(Collider, Polygon, 'collide', (polygon, shape) => PolygonCollider.collide(shape, polygon));

defimpl(PolygonCollider, Polygon, 'overlap', (a, b) => {
  const edges = [...a.edges, ...b.edges];
  let minMag = Number.POSITIVE_INFINITY;
  let minEdge = null;
  const separatingEdge = edges.find((edge) => {
    const n = edge.normal;
    const spanA = a.computeProjectionSpan(n);
    const spanB = b.computeProjectionSpan(n);
    if (spanA.doesOverlap(spanB)) {
      const overlap = spanA.overlap(spanB);
      if (overlap < minMag) {
        minMag = overlap;
        minEdge = edge;
      }
      return false;
    }
    else {
      return true;
    }
  });

  if (separatingEdge) {
    return null;
  }

  return {depth: minMag, normal: minEdge.normal.clone()}
});

function quasiSame(a, b) {
  return Math.abs(a - b) < 0.0005;
}

defimpl(PolygonCollider, Polygon, 'collide', (a, b) => {
  let contact1 = Vector2.zero
  let contact2 = Vector2.zero
  let contactCount = 0
  let minDist = Number.POSITIVE_INFINITY

  a.vertices.forEach(p => {
    // console.log('* a / p', p);
    b.edges.forEach(edge => {
      // console.log('| testing edge', edge);

      const ct = edge.nearestFrom(p)
      const dist = p.squaredDistanceTo(ct);

      if (quasiSame(dist, minDist)) {
        if (!contact1.quasiSame(ct)) {
          // console.log(`| contact 2 (${dist}) [${ct.x}, ${ct.y}]`);
          contact2 = ct
          contactCount = 2
        }
      }
      else if (dist < minDist) {
        // console.log(`| contact 1 (${dist}) [${ct.x}, ${ct.y}]`);

        minDist = dist
        contact1 = ct
        contactCount = 1
      }
    })
  })

  b.vertices.forEach(p => {
    // console.log('* b / p', p);
    a.edges.forEach(edge => {
      // console.log('| testing edge', edge);
      const ct = edge.nearestFrom(p)
      const dist = p.squaredDistanceTo(ct);

      if (quasiSame(dist, minDist)) {
        if (!contact1.quasiSame(ct)) {
          // console.log(`| contact 2 (${dist}) [${ct.x}, ${ct.y}]`);
          contact2 = ct
          contactCount = 2
        }
      }
      else if (dist < minDist) {
        // console.log(`| contact 1 (${dist}) [${ct.x}, ${ct.y}]`);

        minDist = dist
        contact1 = ct
        contactCount = 1
      }
    })
  })

  switch (contactCount) {
    case 0:
      return []
    case 1:
      return [contact1]
    case 2:
      return [contact1, contact2]
  }
})

defimpl(CircleCollider, Polygon, 'overlap', (polygon, circle) => {
  const { minVect } = polygon.vertices.reduce((acc, vertex) => {
    const { minDist } = acc
    const c2v = vertex.sub(circle.position)
    const c2vLength = c2v.length()
    if (c2vLength < minDist) {
      return { ...acc, minDist: c2vLength, minVect: c2v }
    }
    return acc
  }, { minDist: Number.POSITIVE_INFINITY, minVect: null })

  const normals = [...polygon.edges.map(edge => edge.normal), minVect.normalize()]
  let minMag = Number.POSITIVE_INFINITY;
  let minNormal = null;
  const separatingEdge = normals.find(normal => {
    const spanA = polygon.computeProjectionSpan(normal);
    const spanB = circle.computeProjectionSpan(normal);
    if (spanA.doesOverlap(spanB)) {
      const overlap = spanA.overlap(spanB);
      if (overlap < minMag) {
        minMag = overlap;
        minNormal = normal;
      }
      return false;
    }
    else {
      return true;
    }
  })

  if (separatingEdge) {
    return null
  }

  return {depth: minMag, normal: minNormal}
});

defimpl(CircleCollider, Polygon, 'collide', (polygon, circle) => {
  const [point, _dist] = polygon.edges.reduce((acc, edge) => {
    const cp = edge.nearestFrom(circle.position)
    const distanceSquared = circle.position.squaredDistanceTo(cp);
    const [_currentPoint, currentDistSquared] = acc;
    if (distanceSquared < currentDistSquared) {
      return [cp, distanceSquared];
    }
    return acc
  }, [Vector2.zero, Number.POSITIVE_INFINITY])

  return [point]
})

defimpl(Inertia, Polygon, 'compute', ({ radius, sidesCount }, mass) => {
  return 1/6 * mass * radius * radius * (2 + Math.cos(2* Math.PI / sidesCount));
});

defimpl(Aligner, Polygon, 'computeAABB', (polygon, frame) => {
  return polygon.vertices.reduce((aabb, v) => {
    return aabb.update(frame.positionToWorld(v));
  }, new AABB());
});

defimpl(Render, CollisionInfo, 'render', (ci, ctxt, opts) => {
  const { point, magnitude, normal } = ci;
  GfxTools.drawVector(ctxt, point, point.add(normal.scale(20)), { strokeStyle: 'green' });
  GfxTools.drawDisc(ctxt, point.x, point.y, 3, { strokeStyle: 'green' });
});

defimpl(Cloner, CollisionInfo, 'clone', (ci) => {
  const { point, magnitude, normal } = ci;
  return new CollisionInfo(new Vector2(point.x, point.y), new Vector2(normal.x, normal.y), magnitude);
});
