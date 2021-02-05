import { defimpl } from './functional.js';
import { Ray } from './ray.js';
import { Render, Transformer } from './protocols.js';
import * as GfxTools from './gfx.js';

defimpl(Render, Ray, 'render', (ray, ctxt, opts) => {
  GfxTools.drawLine(ctxt, ray.origin.sub(ray.direction.scale(1000)), ray.origin.add(ray.direction.scale(2000)), 'yellow', {lineDash: [5, 5]});
  GfxTools.drawVector(ctxt, ray.origin, ray.origin.add(ray.direction.scale(100)), 'yellow');
  GfxTools.drawDisc(ctxt, ray.origin.x, ray.origin.y, 2, 'yellow');
});

defimpl(Transformer, Ray, 'toLocal', (ray, frame) => {
  return new Ray(frame.positionToLocal(ray.origin), frame.directionToLocal(ray.direction));
});
