import { defimpl } from '../Protocol';
import { Render } from '../protocols/protocols';
import { SpringJoint } from './SpringJoint';
import * as GfxUtils from '../GfxUtils';

defimpl(Render, SpringJoint, {
  render: (joint: SpringJoint, ctxt, opts): undefined => {
    const anchorAPosInWorld = joint.anchorA.rigidbody.frame.positionToWorld(joint.anchorA.position);
    const anchorBPosInWorld = joint.anchorB.rigidbody.frame.positionToWorld(joint.anchorB.position);
    GfxUtils.drawLine(ctxt, anchorAPosInWorld, anchorBPosInWorld, { lineDash: [15, 3, 3, 3], ...opts });
  },
});
