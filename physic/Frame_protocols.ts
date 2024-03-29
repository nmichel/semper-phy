import { defimpl } from './Protocol';
import { Render } from './protocols/protocols';
import { Frame } from './Frame';
import * as GfxTools from './GfxUtils';
import { Vector2 } from './Math';

defimpl(Render, Frame, {
  render: (frame: Frame, ctxt: CanvasRenderingContext2D): undefined => {
    const aAxis = frame.directionToWorld(new Vector2(1.0, 0.0)).scale(20);
    const { x: xa, y: ya } = aAxis;
    const oAxis = new Vector2(-ya, xa);

    GfxTools.drawVector(ctxt, frame.position, frame.position.add(aAxis), { strokeStyle: 'green' });
    GfxTools.drawVector(ctxt, frame.position, frame.position.add(oAxis), { strokeStyle: 'red' });
    GfxTools.drawDisc(ctxt, frame.position.x, frame.position.y, 2, { strokeStyle: 'red' });
  },
});
