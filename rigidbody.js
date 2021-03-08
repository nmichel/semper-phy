import { toDegres, Vector2 } from "./math.js";
import { Frame } from "./frame.js";

class RigidBody {
  constructor(rotation, position, shape, linearVelocity = new Vector2(0, 0), angularVelocity = 0.0, mass = 1, inertia = 1, restitution = 1) {
    this.frame = new Frame(rotation, position);
    this.shape = shape;
    this.linearVelocity = linearVelocity;
    this.angularVelocity = angularVelocity;
    this.mass = mass;
    this.inertia = inertia;
    this.restitution = restitution; 
  }

  updateFrame(deltaInS) {
    this.frame.setPosition(this.frame.position.add(this.linearVelocity.scale(deltaInS)));
    this.frame.setRotation(((this.frame.rotation + this.angularVelocity * deltaInS) + 360) % 360);
  }

  applyImpulse(impulse, contactVector) {
    this.linearVelocity.addToSelf(impulse.scale(1.0 / this.mass));
    this.angularVelocity += toDegres(contactVector.crossCoef(impulse) / this.inertia);
  }
}

export { RigidBody };
