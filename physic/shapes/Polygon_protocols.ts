import {
  Aligner,
  CircleCollider,
  Cloner,
  Collider,
  Inertia,
  PointCaster,
  PolygonCollider,
  RayCaster,
  Render,
  Transformer,
} from '../protocols/protocols';
import { defimpl } from '../Protocol';
import { Edge, Polygon, Vertex } from './Polygon';
import { Ray, RayIntersection } from '../ray';
import { CollisionInfo } from '../protocols/protocols';
import { segmentIntersection, Vector2 } from '../Math';
import { AABB } from '../AABB';
import * as GfxTools from '../GfxUtils';
import { Frame } from '../Frame';
import { Circle } from './Circle';

defimpl(Render, Vertex, {
  render: (vertex: Vertex, ctxt: CanvasRenderingContext2D): undefined => {
    const { x, y } = vertex;
    GfxTools.drawDisc(ctxt, x, y, 5, { strokeStyle: 'red' });
  },
});

defimpl(Render, Edge, {
  render: (edge: Edge, ctxt: CanvasRenderingContext2D, opts): undefined => {
    const { a, b, normal } = edge;
    const d = b.sub(a);
    const m = d.scale(0.5).add(a);
    const offset = normal.scale(20.0);

    if (opts?.debug?.showNormals === true) {
      GfxTools.drawVector(ctxt, m, m.add(normal.scale(15.0)), { strokeStyle: 'red' });
    }
    GfxTools.drawVector(ctxt, m.sub(d.scale(0.4)).add(offset), m.add(d.scale(0.4)).add(offset), { strokeStyle: 'yellow' });
  },
});

defimpl(Render, Polygon, {
  render: (polygon: Polygon, ctxt: CanvasRenderingContext2D, opts: any): undefined => {
    GfxTools.drawPolygon(ctxt, polygon.vertices, { strokeStyle: 'white' });
    if (opts?.debug?.enabled === true) {
      if (opts?.debug?.showVertices === true) {
        polygon.vertices.forEach(v => Render.render(v, ctxt, opts));
      }
      if (opts?.debug?.showEdges === true) {
        polygon.edges.forEach(e => Render.render(e, ctxt, opts));
      }
    }
  },
});

defimpl(Transformer, Polygon, {
  toWorld: (polygon: Polygon, frame: Frame): Polygon => {
    return new Polygon(polygon.vertices.map(v => frame.positionToWorld(v)));
  },
  toLocal: function (obj: Polygon, _frame: Frame): Polygon {
    throw new Error('Function not implemented.');
  },
});

defimpl(RayCaster, Polygon, {
  cast: (polygon: Polygon, ray: Ray): RayIntersection[] => {
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
    }, [] as RayIntersection[]);
  },
});

defimpl(PointCaster, Polygon, {
  contains: (polygon: Polygon, point: Vector2): boolean => {
    return !polygon.edges.find(({ a, b }) => Math.sign(b.sub(a).crossCoef(point.sub(a))) < 0);
  },
});

defimpl(Collider, Polygon, {
  overlap: (polygon: Polygon, shape: any): { depth: number; normal: Vector2 } | null => PolygonCollider.overlap(shape, polygon),
  collide: (polygon: Polygon, shape: any): Vector2[] => PolygonCollider.collide(shape, polygon),
});

const ESPILON: number = 0.0005;

function quasiSame(a, b) {
  return Math.abs(a - b) < ESPILON;
}

defimpl(PolygonCollider, Polygon, {
  overlap: (a: Polygon, b: Polygon): { depth: number; normal: Vector2 } | null => {
    const edges = [...a.edges, ...b.edges];
    let minMag = Number.POSITIVE_INFINITY;
    let minEdge: Edge = {} as Edge;
    const separatingEdge = edges.find(edge => {
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
      } else {
        return true;
      }
    });

    if (separatingEdge) {
      return null;
    }

    return { depth: minMag, normal: minEdge.normal.clone() };
  },

  collide: (a, b): Vector2[] => {
    let contact1 = Vector2.zero;
    let contact2 = Vector2.zero;
    let contactCount = 0;
    let minDist = Number.POSITIVE_INFINITY;

    a.vertices.forEach(p => {
      // console.log('* a / p', p);
      b.edges.forEach(edge => {
        // console.log('| testing edge', edge);

        const ct = edge.nearestFrom(p);
        const dist = p.squaredDistanceTo(ct);

        if (quasiSame(dist, minDist)) {
          if (!contact1.quasiSame(ct)) {
            // console.log(`| contact 2 (${dist}) [${ct.x}, ${ct.y}]`);
            contact2 = ct;
            contactCount = 2;
          }
        } else if (dist < minDist) {
          // console.log(`| contact 1 (${dist}) [${ct.x}, ${ct.y}]`);

          minDist = dist;
          contact1 = ct;
          contactCount = 1;
        }
      });
    });

    b.vertices.forEach(p => {
      // console.log('* b / p', p);
      a.edges.forEach(edge => {
        // console.log('| testing edge', edge);
        const ct = edge.nearestFrom(p);
        const dist = p.squaredDistanceTo(ct);

        if (quasiSame(dist, minDist)) {
          if (!contact1.quasiSame(ct)) {
            // console.log(`| contact 2 (${dist}) [${ct.x}, ${ct.y}]`);
            contact2 = ct;
            contactCount = 2;
          }
        } else if (dist < minDist) {
          // console.log(`| contact 1 (${dist}) [${ct.x}, ${ct.y}]`);

          minDist = dist;
          contact1 = ct;
          contactCount = 1;
        }
      });
    });

    switch (contactCount) {
      case 1:
        return [contact1];
      case 2:
        return [contact1, contact2];
    }

    return [];
  },
});

defimpl(CircleCollider, Polygon, {
  overlap: (polygon: Polygon, circle: Circle): { depth: number; normal: Vector2 } | null => {
    const { minVect } = polygon.vertices.reduce(
      (acc, vertex: Vector2) => {
        const { minDist } = acc;
        const c2v = vertex.sub(circle.position);
        const c2vLength = c2v.length();
        if (c2vLength < minDist) {
          return { ...acc, minDist: c2vLength, minVect: c2v };
        }
        return acc;
      },
      { minDist: Number.POSITIVE_INFINITY } as { minDist: number; minVect: Vector2 }
    );

    const normals = [...polygon.edges.map(edge => edge.normal), minVect.normalize()];
    let minMag = Number.POSITIVE_INFINITY;
    let minNormal: Vector2 = {} as Vector2;
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
      } else {
        return true;
      }
    });

    if (separatingEdge) {
      return null;
    }

    return { depth: minMag, normal: minNormal };
  },
  collide: (polygon: Polygon, circle: Circle): Vector2[] => {
    const [point, _dist] = polygon.edges.reduce(
      (acc, edge) => {
        const cp = edge.nearestFrom(circle.position);
        const distanceSquared = circle.position.squaredDistanceTo(cp);
        const [_currentPoint, currentDistSquared] = acc;
        if (distanceSquared < currentDistSquared) {
          return [cp, distanceSquared];
        }
        return acc;
      },
      [Vector2.zero, Number.POSITIVE_INFINITY]
    );

    return [point];
  },
});

defimpl(Inertia, Polygon, {
  compute: ({ vertices }: Polygon, mass: number): number => {
    // source : https://math.stackexchange.com/questions/59470/calculating-moment-of-inertia-in-2d-planar-polygon

    let inertia = 0;
    let totalCrossProducts = 0;

    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      const v1 = vertices[i];
      const v2 = vertices[j];
      const crossProduct = v1.crossCoef(v2);
      const dotProduct = v1.dot(v2);

      inertia += (v1.squaredLength() + dotProduct + v2.squaredLength()) * crossProduct;
      totalCrossProducts += crossProduct;
    }

    inertia *= mass / (6 * totalCrossProducts);

    return inertia;
  },
});

defimpl(Aligner, Polygon, {
  computeAABB: (polygon: Polygon, frame: Frame | null): AABB => {
    if (frame) {
      return polygon.vertices.reduce((aabb, v) => {
        return aabb.update(frame.positionToWorld(v));
      }, new AABB());
    } else {
      return polygon.vertices.reduce((aabb, v) => {
        return aabb.update(v);
      }, new AABB());
    }
  },
});

defimpl(Render, CollisionInfo, {
  render: (ci: CollisionInfo, ctxt: CanvasRenderingContext2D): undefined => {
    const { point, normal } = ci;
    GfxTools.drawVector(ctxt, point, point.add(normal.scale(20)), { strokeStyle: 'green' });
    GfxTools.drawDisc(ctxt, point.x, point.y, 3, { strokeStyle: 'green' });
  },
});

defimpl(Cloner, CollisionInfo, {
  clone: (ci: CollisionInfo): CollisionInfo => {
    const { point, normal } = ci;
    return new CollisionInfo(new Vector2(point.x, point.y), new Vector2(normal.x, normal.y));
  },
});
