import { defimpl } from './functional.js';
import { AABB } from './aabb.js';
import { Render } from './protocols/render';

defimpl(Render, AABB, {
  render: (aabb: AABB, ctxt: CanvasRenderingContext2D): undefined => {
    const {x: minX, y: minY} = aabb.min;
    const {x: maxX, y: maxY} = aabb.max;
    const width = maxX - minX;
    const height = maxY - minY;
    ctxt.strokeStyle = 'blue';
    ctxt.strokeRect(minX, minY, width, height);
  }
})