import { Polygon } from './geom.js';

class DebugPolygon {
  constructor(p, idx) {
    this.p = p;
    this.idx = idx;
    this.collide = false;
  }
}

export { DebugPolygon };
