import { Span, Vector2 } from './math.js'

const Vertex = Vector2;

class Edge {
  constructor(a, b) {
    this.a = a;
    this.b = b;

    const {x, y} = b.sub(a);
    this.normal = new Vector2(y, -x);
    this.normal.normalizeSelf();
  }
}

class Polygon {
  // constructor([Vertex]) -> Polygon
  constructor(vertices) {
    this.vertices = vertices;

    const lastVert = this.vertices[this.vertices.length - 1];
    const [_v, edges] = this.vertices.reduce(([prevVert, edges], vert) => {
      edges.push(new Edge(prevVert, vert));
      return [vert, edges]
    }, [lastVert, []]);
    this.edges = edges;
  }

  // computeProjectionSpan(Polygon, Vector2) -> Span
  computeProjectionSpan(normal) {
    return this.vertices.reduce((span, v) => span.update(v.dot(normal)), new Span(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY));
  }
}

const sat = (a, b) => {
  const edges = [...(a.edges), ...(b.edges)];
  let minMag = Number.POSITIVE_INFINITY;
  let minEdge = null;
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
    }
    else {
      return true;
    }
  });

  return {found: !!separatingEdge, separatingEdge: minEdge, magnitude: minMag}
};

const buildVertexFromAngleAndRadius = (angle, radius) => {
  return new Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

const buildCircleContainedPolygon = (center, radius, vertexCount) => {
  const alpha = Math.random() * Math.PI;
  const vertices = [buildVertexFromAngleAndRadius(alpha, radius).addToSelf(center)];
  const offset = (2.0 * Math.PI) / vertexCount;
  for (let i = 1; i < vertexCount; ++i) {
    vertices.push(buildVertexFromAngleAndRadius(alpha + i * offset, radius).addToSelf(center));
  }

  return new Polygon(vertices);
}

class CollisionInfo {
  // constructor(Edge, Number) -> CollisionInfo
  constructor(edge, magnitude, bearer) {
    this.edge = edge
    this.magnitude = magnitude
    this.bearer = bearer
  }
}

export { CollisionInfo, Edge, Polygon, Vertex, buildCircleContainedPolygon, sat };
