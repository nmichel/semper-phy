import { defimpl } from './functional.js';
import { CollisionInfo, Edge, Polygon, Vertex } from './geom.js';
import { RayIntersection } from './ray.js';
import { PointCaster, RayCaster, Render, Transformer } from './protocols.js';
import { segmentIntersection } from './math.js';
import * as GfxTools from './gfx.js';

defimpl(Render, Vertex, 'render', (vertex, ctxt, opts) => {
  const { x, y } = vertex;
  GfxTools.drawDisc(ctxt, x, y, 5, 'red');
});

defimpl(Render, Edge, 'render', (edge, ctxt, opts) => {
  const { a, b, normal } = edge;
  const d = b.sub(a);
  const m = d.scale(0.5).add(a);
  const offset = normal.scale(20.0);
  
  GfxTools.drawVector(ctxt, m, m.add(normal.scale(15.0)), 'red');
  GfxTools.drawVector(ctxt, m.sub(d.scale(0.4)).add(offset), m.add(d.scale(0.4)).add(offset), 'yellow');
});

defimpl(Render, Polygon, 'render', (polygon, ctxt, opts) => {
  const { debug = false, color = 'white' } = opts;

  GfxTools.drawPolygon(ctxt, polygon.vertices, color);
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

defimpl(Render, CollisionInfo, 'render', (ci, ctxt, opts) => {
  const { magnitude, edge: {a, b, normal } } = ci;
  const d = b.sub(a);
  const m = d.scale(0.5).add(a);
  GfxTools.drawVector(ctxt, m, m.add(normal.scale(magnitude)), 'green');
});
