import { defimpl } from '../Protocol';
import { Render } from '../protocols/protocols';
import { AttractorJoint } from './AttractorJoint';
import * as GfxUtils from '../GfxUtils';

defimpl(Render, AttractorJoint, {
  render: (joint: AttractorJoint, ctxt, opts): undefined => {
    const anchorAPosInWorld = joint.anchorA.rigidbody.frame.positionToWorld(joint.anchorA.position);
    const anchorBPosInWorld = joint.anchorB.rigidbody.frame.positionToWorld(joint.anchorB.position);
    GfxUtils.drawLine(ctxt, anchorAPosInWorld, anchorBPosInWorld, { lineDash: [15, 3, 3, 3], ...opts });
  },
});
