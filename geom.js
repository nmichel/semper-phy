import { Vector2 } from './math.js'

const Vertex = Vector2;

class Edge {
  constructor(a, b) {
    this.a = a;
    this.b = b;

    const {x, y} = b.sub(a);
    this.normal = new Vector2(-y, x);
    this.normal.normalizeSelf();
  }
}

class Polygon {
  constructor(vertices) {
    this.vertices = vertices;

    const lastVert = this.vertices[this.vertices.length - 1];
    const [_v, edges] = this.vertices.reduce(([prevVert, edges], vert) => {
      edges.push(new Edge(prevVert, vert));
      return [vert, edges]
    }, [lastVert, []]);
    this.edges = edges;
  }
}

const sat = (a, b) => {
  const normals = [...(a.edges.map(e => e.normal)), ...(b.edges.map(e => e.normal))];
  return normals.find(n => {
    const [amin, amax] = a.vertices.reduce(([vmin, vmax], v) => {
      const proj = v.dot(n);
      return [Math.min(vmin, proj), Math.max(vmax, proj)];
    }, [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]);
    
    const [bmin, bmax] = b.vertices.reduce(([vmin, vmax], v) => {
      const proj = v.dot(n);
      return [Math.min(vmin, proj), Math.max(vmax, proj)];
    }, [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]);

    if (amin > bmax || bmin > amax) {
      return true;
    }
    return false;
  });
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

export { Polygon, Edge, Vertex, buildCircleContainedPolygon, sat };
