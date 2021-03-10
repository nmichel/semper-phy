import { Vector2 } from './math.js';

const setupStyle = (ctxt, opts) => {
  ctxt.setLineDash(opts.lineDash || []);
  ctxt.strokeStyle = opts.strokeStyle || 'white';
  ctxt.fillStyle = opts.fillStyle || ctxt.strokeStyle;
  ctxt.lineWidth = opts.lineWidth || 1;
};

const drawLine = (ctxt, a, b, opts = {}) => {
  setupStyle(ctxt, opts);

  ctxt.beginPath();
  ctxt.moveTo(a.x, a.y)
  ctxt.lineTo(b.x, b.y);
  ctxt.stroke();
}

const drawVector = (ctxt, a, b, opts = {}) => {
  const d = b.sub(a);
  d.normalizeSelf();
  d.scaleSelf(5);
  const {x, y} = d;
  const m = new Vector2(-y, x);

  setupStyle(ctxt, opts);

  ctxt.beginPath();
  ctxt.moveTo(a.x, a.y)
  ctxt.lineTo(b.x, b.y);
  ctxt.stroke();

  const arrowA = b.sub(d).add(m);
  const arrowB = b.sub(d).sub(m);
  ctxt.beginPath();
  ctxt.moveTo(arrowA.x, arrowA.y)
  ctxt.lineTo(b.x, b.y)
  ctxt.lineTo(arrowB.x, arrowB.y);
  ctxt.stroke();
}

const drawDisc = (ctxt, x, y, radius, opts = {}) => {
  setupStyle(ctxt, opts);

  ctxt.beginPath();
  ctxt.arc(x, y, radius, 0, 2 * Math.PI);
  ctxt.fill();
}

const drawCircle = (ctxt, x, y, radius, opts = {}) => {
  setupStyle(ctxt, opts);

  ctxt.beginPath();
  ctxt.arc(x, y, radius, 0, 2 * Math.PI);
  ctxt.stroke();
}

const drawPolygon = (ctxt, vertices, opts = {}) => {
  setupStyle(ctxt, opts);
  
  // ctxt.fillStyle = 'white';
  const v0 = vertices[0];
  ctxt.beginPath();
  ctxt.moveTo(v0.x, v0.y)
  for (let i = 1; i < vertices.length; ++i) {
    const v = vertices[i];
    ctxt.lineTo(v.x, v.y);
  }
  ctxt.closePath();
  ctxt.stroke();
  //ctxt.fill();
}

export {
  drawCircle,
  drawDisc,
  drawLine,
  drawPolygon,
  drawVector
};
