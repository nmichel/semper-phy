import { Inertia } from "./protocols/inertia.js";
import { toDegres, Vector2 } from "./math.js";
import { Frame } from "./frame.js";

const APPLY_GRAVITY = true;
const GRAVITY = new Vector2(0, 9.81);

const APPLY_DAMPING = true;
const DAMPING = 0.05;

class RigidBody {
  constructor(rotation, position, shape, linearVelocity = new Vector2(0, 0), angularVelocity = 0.0, mass = 1, restitution = 0.9) {
    this.frame = new Frame(rotation, position);
    this.shape = shape;
    this.linearVelocity = linearVelocity;
    this.angularVelocity = angularVelocity;
    this.mass = mass;
    this.inertia = mass == 0 ? 0 : Inertia.compute(shape, mass);
    this.restitution = restitution;
    this.inverseMass = mass > 0 ? (1.0 / mass) : 0.0;
    this.inverseInertia = this.inertia > 0 ? (1.0 / this.inertia) : 0.0;

    this.listeners = [];
  }

  addListener(listenerFn) {
    this.listeners.push(listenerFn);
  }

  updateFrame(deltaInS) {
    if (APPLY_GRAVITY && this.inverseMass > 0) {
      this.linearVelocity.addToSelf(GRAVITY.scale(10*deltaInS));
    }

    if (APPLY_DAMPING) {
      this.linearVelocity.scaleSelf(1.0 - (DAMPING * deltaInS));
      this.angularVelocity *= (1.0 - (DAMPING * deltaInS));
    }

    this.frame.setPosition(this.frame.position.add(this.linearVelocity.scale(deltaInS)));
    this.frame.setRotation(((this.frame.rotation + this.angularVelocity * deltaInS) + 360) % 360);
    this.listeners.forEach(listenerFn => listenerFn());
  }

  applyImpulse(impulse, contactVector) {
    this.linearVelocity.addToSelf(impulse.scale(this.inverseMass));
    this.angularVelocity += toDegres(contactVector.crossCoef(impulse) * this.inverseInertia);
  }
}

export { RigidBody };
