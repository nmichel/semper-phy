import { Inertia } from './protocols/inertia';
import { Aligner } from './protocols/aligner.ts';
import { toDegres, Vector2 } from './math.js';
import { Frame } from './frame';

const APPLY_GRAVITY = true;
const GRAVITY = new Vector2(0, 9.81);

const APPLY_DAMPING = true;
const DAMPING = 0.05;

class RigidBody {

  static FLAGS = {
    LOCK_ROTATION: 1 << 0,
    LOCK_TRANSLATION: 1 << 1,
  };

  static idSeed = 0;

  constructor(rotation, position, shape, linearVelocity = new Vector2(0, 0), angularVelocity = 0.0, mass = 1, restitution = 0.9) {
    this.id = ++RigidBody.idSeed;
    this.frame = new Frame(rotation, position);
    this.shape = shape;
    this.linearVelocity = linearVelocity;
    this.angularVelocity = angularVelocity;
    this.mass = mass;
    this.inertia = mass == 0 ? 0 : Inertia.compute(shape, mass);
    this.restitution = restitution;
    this.inverseMass = mass > 0 ? 1.0 / mass : 0.0;
    this.inverseInertia = this.inertia > 0 ? 1.0 / this.inertia : 0.0;
    this.aabb = Aligner.computeAABB(this.shape, this.frame);
    this.forces = [];
    this.listeners = [];
  }

  set flags(flags) {
    this.#flags = flags;
  }

  addForce(force) {
    this.forces.push(force.clone());
  }

  addListener(listenersDesc) {
    this.listeners.push(listenersDesc);
  }

  updateFrame(deltaInS) {
    if (APPLY_GRAVITY && this.inverseMass > 0) {
      this.linearVelocity.addToSelf(GRAVITY.scale(10 * deltaInS));
    }

    if (this.inverseMass > 0) {
      this.forces.forEach(force => this.linearVelocity.addToSelf(force.scale(deltaInS * this.inverseMass)));
      this.forces = [];
    }

    if (APPLY_DAMPING) {
      this.linearVelocity.scaleSelf(1.0 - DAMPING * deltaInS);
      this.angularVelocity *= 1.0 - DAMPING * deltaInS;
    }

    this.frame.setPosition(this.frame.position.add(this.linearVelocity.scale(deltaInS)));
    this.frame.setRotation((this.frame.rotation + this.angularVelocity * deltaInS + 360) % 360);

    this.aabb = Aligner.computeAABB(this.shape, this.frame);
  }

  notifyFrameChangedListeners() {
    this.listeners.forEach(({ handleFrameUpdated }) => handleFrameUpdated?.());
  }

  notifyCollisionsListeners(other, collisionInfo) {
    this.listeners.forEach(({ handleCollision }) => handleCollision?.(this, other, collisionInfo));
  }

  applyImpulse(impulse, contactVector) {
    if (! (this.#flags & RigidBody.FLAGS.LOCK_TRANSLATION)) {
      this.linearVelocity.addToSelf(impulse.scale(this.inverseMass));
    }
    if (! (this.#flags & RigidBody.FLAGS.LOCK_ROTATION)) {
      this.angularVelocity += toDegres(contactVector.crossCoef(impulse) * this.inverseInertia);
    }
  }

  #flags = 0;
}

export { RigidBody };
