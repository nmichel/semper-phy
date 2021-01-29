import { defimpl } from './functional.js';
import { DebugPolygon } from './geom_debug.js';
import { Render } from './protocols.js';

defimpl(Render, DebugPolygon, 'render', (p, ctxt, opts) => {
  const color = p.collide ? 'blue' : 'white';
  Render.render(p.p, ctxt, {...opts, color});
});
