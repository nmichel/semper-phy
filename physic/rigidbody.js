import { Inertia } from './protocols/inertia';
import { Aligner } from './protocols/aligner.ts';
import { Vector2 } from './math.js';
import { Frame } from './frame';

const APPLY_GRAVITY = true;
const GRAVITY = new Vector2(0, 9.81);

const APPLY_DAMPING = true;
const DAMPING = 0.05;

class RigidBody {
  static COLLISION_GROUPS = {
    COLLISION_GROUP_0: 1 << 0,
    COLLISION_GROUP_1: 1 << 1,
    COLLISION_GROUP_2: 1 << 2,
    COLLISION_GROUP_3: 1 << 3,
    COLLISION_GROUP_4: 1 << 4,
    COLLISION_GROUP_5: 1 << 5,
    COLLISION_GROUP_6: 1 << 6,
    COLLISION_GROUP_7: 1 << 7,
    COLLISION_GROUP_8: 1 << 8,
    COLLISION_GROUP_9: 1 << 9,
    COLLISION_GROUP_10: 1 << 10,
    COLLISION_GROUP_11: 1 << 11,
    COLLISION_GROUP_12: 1 << 12,
    COLLISION_GROUP_13: 1 << 13,
    COLLISION_GROUP_14: 1 << 14,
    COLLISION_GROUP_15: 1 << 15,
    ALL_GROUPS: 0xffff,
  };

  static FLAGS = {
    LOCK_ROTATION: 1 << 0,
    LOCK_TRANSLATION: 1 << 1,
  };

  static idSeed = 0;

  constructor(shape, mass = 1) {
    this.id = ++RigidBody.idSeed;
    this.frame = new Frame();
    this.shape = shape;
    this.mass = mass;
    this.inertia = mass == 0 ? 0 : Inertia.compute(shape, mass);
    this.inverseMass = mass > 0 ? 1.0 / mass : 0.0;
    this.inverseInertia = this.inertia > 0 ? 1.0 / this.inertia : 0.0;
    this.aabb = Aligner.computeAABB(this.shape, this.frame);
    this.forces = [];
    this.listeners = [];
  }

  get position() {
    return this.frame.position;
  }

  set position(position) {
    this.frame.position = position.clone();
  }

  get rotation() {
    return this.frame.rotation;
  }

  set rotation(rotation) {
    this.frame.rotation = rotation;
  }

  get linearVelocity() {
    return this.#linearVelocity.clone();
  }

  set linearVelocity(velocity) {
    this.#linearVelocity = velocity.clone();
  }

  get angularVelocity() {
    return this.#angularVelocity;
  }

  set angularVelocity(velocity) {
    this.#angularVelocity = velocity;
  }

  get restitution() {
    return this.#restitution;
  }

  set restitution(restitution) {
    this.#restitution = restitution;
  }

  get friction() {
    return this.#friction;
  }

  set friction(friction) {
    this.#friction = friction;
  }

  set flags(flags) {
    this.#flags = flags;
  }

  get collisionFlags() {
    return this.#collisionFlags;
  }

  set collisionFlags(flags) {
    this.#collisionFlags = flags;
  }

  get collisionMask() {
    return this.#collisionMask;
  }

  set collisionMask(flags) {
    this.#collisionMask = flags;
  }

  addForce(force) {
    this.forces.push(force.clone());
  }

  clearForces() {
    this.forces = [];
  }

  addListener(listenersDesc) {
    this.listeners.push(listenersDesc);
  }

  updateFrame(deltaInS) {
    if (APPLY_GRAVITY && this.inverseMass > 0) {
      this.#linearVelocity.addToSelf(GRAVITY.scale(deltaInS));
    }

    if (this.inverseMass > 0) {
      this.forces.forEach(force => this.#linearVelocity.addToSelf(force.scale(deltaInS * this.inverseMass)));
    }

    if (APPLY_DAMPING) {
      this.#linearVelocity.scaleSelf(1.0 - DAMPING * deltaInS);
      this.#angularVelocity *= 1.0 - DAMPING * deltaInS;
    }

    this.frame.position = this.frame.position.add(this.#linearVelocity.scale(deltaInS));
    this.frame.rotation = (this.frame.rotation + this.#angularVelocity * deltaInS + 2.0 * Math.PI) % (2.0 * Math.PI);

    this.aabb = Aligner.computeAABB(this.shape, this.frame);
  }

  notifyFrameChangedListeners() {
    this.listeners.forEach(({ handleFrameUpdated }) => handleFrameUpdated?.());
  }

  notifyCollisionsListeners(other, collisionInfo) {
    this.listeners.forEach(({ handleCollision }) => handleCollision?.(this, other, collisionInfo));
  }

  applyImpulse(impulse, contactVector) {
    if (!(this.#flags & RigidBody.FLAGS.LOCK_TRANSLATION)) {
      this.#linearVelocity.addToSelf(impulse.scale(this.inverseMass));
    }
    if (!(this.#flags & RigidBody.FLAGS.LOCK_ROTATION)) {
      this.#angularVelocity += contactVector.crossCoef(impulse) * this.inverseInertia;
    }
  }

  #linearVelocity = new Vector2(0, 0);
  #angularVelocity = 0;
  #restitution = 0.9;
  #friction = 0.2;
  #flags = 0;
  #collisionFlags = RigidBody.COLLISION_GROUPS.COLLISION_GROUP_0;
  #collisionMask = RigidBody.COLLISION_GROUPS.ALL_GROUPS;
}

export { RigidBody };
