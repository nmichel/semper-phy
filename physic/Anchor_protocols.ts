import { Anchor } from './Anchor';
import { Render, Transformer } from './protocols/protocols';
import { defimpl } from './Protocol';
import * as GfxUtils from './GfxUtils';
import { Frame } from './Frame';

defimpl(Render, Anchor, {
  render: (anchor: Anchor, ctxt: CanvasRenderingContext2D, opts): undefined => {
    GfxUtils.drawDisc(ctxt, anchor.position.x, anchor.position.y, 3, { strokeStyle: 'green' });
  },
});

defimpl(Transformer, Anchor, {
  toLocal: (anchor: Anchor, frame: Frame): Anchor => {
    return new Anchor(anchor.rigidbody, frame.positionToLocal(anchor.position));
  },

  toWorld: (anchor: Anchor, frame: Frame): Anchor => {
    return new Anchor(anchor.rigidbody, frame.positionToWorld(anchor.position));
  },
});
