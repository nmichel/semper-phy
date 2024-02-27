import { Anchor } from '../Anchor';
import { Joint } from './Joint';

export class SpringJoint extends Joint {
  constructor(anchorA: Anchor, anchorB: Anchor, restLength: number, strength: number = 1) {
    super(anchorA, anchorB);

    this.#strength = strength;
    this.#restLength = restLength;
  }

  update() {
    const anchorAPosInWorld = this.anchorA.rigidbody.frame.positionToWorld(this.anchorA.position);
    const anchorBPosInWorld = this.anchorB.rigidbody.frame.positionToWorld(this.anchorB.position);
    const direction = anchorBPosInWorld.sub(anchorAPosInWorld);
    const length = direction.length();
    const deltaLength = length - this.#restLength;

    direction.normalizeSelf();
    const forceMagnitude = deltaLength * this.#strength;
    direction.scaleSelf(forceMagnitude * 0.5);

    this.anchorA.rigidbody.addForceAtPoint(anchorAPosInWorld, direction);
    this.anchorB.rigidbody.addForceAtPoint(anchorBPosInWorld, direction.scaleSelf(-1));
  }

  #restLength;
  #strength;
}
