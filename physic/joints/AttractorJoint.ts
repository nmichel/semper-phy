import { Anchor } from '../Anchor';
import { Joint } from './Joint';

export class AttractorJoint extends Joint {
  constructor(anchorA: Anchor, anchorB: Anchor, strength: number = 1) {
    super(anchorA, anchorB);

    this.#strength = strength;
  }

  update() {
    const anchorAPosInWorld = this.anchorA.rigidbody.frame.positionToWorld(this.anchorA.position);
    const anchorBPosInWorld = this.anchorB.rigidbody.frame.positionToWorld(this.anchorB.position);
    const vectorA2B = anchorBPosInWorld.sub(anchorAPosInWorld).scaleSelf(this.#strength * 0.5);
    this.anchorA.rigidbody.addForceAtPoint(anchorAPosInWorld, vectorA2B);
    this.anchorB.rigidbody.addForceAtPoint(anchorBPosInWorld, vectorA2B.scaleSelf(-1));
  }

  #strength;
}
