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
  // constructor([Vertex], Integer) -> Polygon
  constructor(vertices, radius) {
    this.vertices = vertices;
    this.radius = radius;
    this.sidesCount = vertices.length;

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

const buildVertexFromAngleAndRadius = (angle, radius) => {
  return new Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

const buildCircleContainedPolygon = (center, radius, vertexCount) => {
  const alpha = 0;
  const vertices = [buildVertexFromAngleAndRadius(alpha, radius).addToSelf(center)];
  const offset = (2.0 * Math.PI) / vertexCount;
  for (let i = 1; i < vertexCount; ++i) {
    vertices.push(buildVertexFromAngleAndRadius(alpha + i * offset, radius).addToSelf(center));
  }

  return new Polygon(vertices, radius);
}

export { Edge, Polygon, Vertex, buildCircleContainedPolygon };
