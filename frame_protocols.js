import { defimpl } from './functional.js';
import { Frame } from './frame.js';
import { Render } from './protocols.js';
import * as GfxTools from './gfx.js';
import { Vector2 } from './math.js';

defimpl(Render, Frame, 'render', (frame, ctxt, opts) => {
  const aAxis = frame.directionToWorld(new Vector2(1.0, 0.0)).scale(20);
  const { x: xa, y: ya } = aAxis;
  const oAxis = new Vector2(-ya, xa);

  GfxTools.drawVector(ctxt, frame.position, frame.position.add(aAxis), 'green');
  GfxTools.drawVector(ctxt, frame.position, frame.position.add(oAxis), 'red');
  GfxTools.drawDisc(ctxt, frame.position.x, frame.position.y, 2, 'red');
});
