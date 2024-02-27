import { Anchor } from '../Anchor';
import { Joint } from './Joint';

export class RepulsorJoint extends Joint {
  constructor(anchorA: Anchor, anchorB: Anchor, length: number, strength: number = 1) {
    super(anchorA, anchorB);

    this.#length = length;
    this.#strength = strength;
  }

  update() {
    const anchorAPosInWorld = this.anchorA.rigidbody.frame.positionToWorld(this.anchorA.position);
    const anchorBPosInWorld = this.anchorB.rigidbody.frame.positionToWorld(this.anchorB.position);
    const direction = anchorBPosInWorld.sub(anchorAPosInWorld);
    const length = direction.length();
    const deltaLength = this.#length - length;

    direction.normalizeSelf();
    const forceMagnitude = Math.max(0, deltaLength) * this.#strength * 0.5;
    direction.scaleSelf(forceMagnitude);

    this.anchorB.rigidbody.addForceAtPoint(anchorBPosInWorld, direction);
    this.anchorA.rigidbody.addForceAtPoint(anchorAPosInWorld, direction.scaleSelf(-1));
  }

  #length: number;
  #strength: number;
}
