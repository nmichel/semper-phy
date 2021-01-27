import { defimpl } from './functional.js';
import { Edge, Polygon, Vertex } from './geom.js';
import { Render } from './protocols.js';
import * as GfxTools from './gfx.js';

defimpl(Render, Vertex, 'render', (v, ctxt, opts) => {
  const {x, y} = v;
  GfxTools.drawDisc(ctxt, x, y, 5, 'red');
});

defimpl(Render, Edge, 'render', (e, ctxt, opts) => {
  const {a, b, normal} = e;
  const d = b.sub(a);
  const m = d.scale(0.5).add(a);
  GfxTools.drawVector(ctxt, m, m.add(normal.scale(20.0)), 'red');
  
  const l = d.length();
  const offset = normal.scale(-20.0);

  GfxTools.drawVector(ctxt, m.sub(d.scale(0.4)).add(offset), m.add(d.scale(0.4)).add(offset), 'yellow');
});

defimpl(Render, Polygon, 'render', (p, ctxt, {debug, ...opts} = {debug: false}) => {
  GfxTools.drawPolygon(ctxt, p, 'white');

  if (debug) {
    p.vertices.forEach(v => Render.render(v, ctxt, opts));

    p.edges.forEach((e) => {
      Render.render(e, ctxt, opts);
    })
  }
});
