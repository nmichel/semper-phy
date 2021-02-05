import { Vector2 } from './math.js';

const setupLineStyle = (ctxt, {lineDash = []}) => {
  ctxt.setLineDash(lineDash);
};

const drawLine = (ctxt, a, b, color, opts = {}) => {
  setupLineStyle(ctxt, opts);
  ctxt.strokeStyle = color;
  ctxt.beginPath();
  ctxt.moveTo(a.x, a.y)
  ctxt.lineTo(b.x, b.y);
  ctxt.stroke();
}

const drawVector = (ctxt, a, b, color, opts = {}) => {
  const d = b.sub(a);
  d.normalizeSelf();
  d.scaleSelf(5);
  const {x, y} = d;
  const m = new Vector2(-y, x);

  ctxt.strokeStyle = color;

  setupLineStyle(ctxt, opts);
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

const drawDisc = (ctxt, x, y, radius, color, opts = {}) => {
  setupLineStyle(ctxt, opts);
  ctxt.beginPath();
  ctxt.fillStyle=color;
  ctxt.arc(x, y, radius, 0, 2 * Math.PI);
  ctxt.fill();
}

const drawCircle = (ctxt, x, y, radius, color, opts = {}) => {
  setupLineStyle(ctxt, opts);
  ctxt.beginPath();
  ctxt.strokeStyle=color;
  ctxt.arc(x, y, radius, 0, 2 * Math.PI);
  ctxt.stroke();
}

const drawPolygon = (ctxt, polygon, color, opts = {}) => {
  const vertices = polygon.vertices;
  const v0 = vertices[0];
  setupLineStyle(ctxt, opts);
  ctxt.strokeStyle = color;
  ctxt.beginPath();
  ctxt.moveTo(v0.x, v0.y)
  for (let i = 1; i < vertices.length; ++i) {
    const v = vertices[i];
    ctxt.lineTo(v.x, v.y);
  }
  ctxt.closePath();
  ctxt.stroke();
}

export {
  drawCircle,
  drawDisc,
  drawLine,
  drawPolygon,
  drawVector
};
