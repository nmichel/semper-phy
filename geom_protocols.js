import { defimpl } from './functional.js';
import { Edge, Polygon, Vertex } from './geom.js';
import { CollisionInfo } from './protocols.js';
import { RayIntersection } from './ray.js';
import { CircleCollider, Collider, PointCaster, PolygonCollider, RayCaster, Render, Transformer } from './protocols.js';
import { segmentIntersection } from './math.js';
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

defimpl(Collider, Polygon, 'collide', (polygon, shape) => PolygonCollider.collide(shape, polygon));

defimpl(PolygonCollider, Polygon, 'collide', (a, b) => {
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
    return [];
  }

  let acc = [];

  acc = a.vertices.reduce((acc, p) => {
    if (PointCaster.contains(b, p)) {
      return [...acc, new CollisionInfo(p, minEdge.normal, minMag)]
    }
    return acc;
  }, acc);

  acc = b.vertices.reduce((acc, p) => {
    if (PointCaster.contains(a, p)) {
      return [...acc, new CollisionInfo(p, minEdge.normal, minMag)]
    }
    return acc;
  }, acc);

  return acc;
});

defimpl(CircleCollider, Polygon, 'collide', (polygon, circle) => {
  const { minVect } = polygon.vertices.reduce((acc, vertex) => {
    const { minDist } = acc = acc
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
    return []
  }

  const p = circle.position.sub(minNormal.scale(circle.radius))
  return [new CollisionInfo(p, minNormal, minMag)]
})

defimpl(Render, CollisionInfo, 'render', (ci, ctxt, opts) => {
  const { point, magnitude, normal } = ci;
  GfxTools.drawVector(ctxt, point, point.add(normal.scale(20)), { strokeStyle: 'green' });
  GfxTools.drawDisc(ctxt, point.x, point.y, 3, { strokeStyle: 'green' });
});
