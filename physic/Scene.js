import { CollisionInfo, Collider, PointCaster } from './protocols/protocols';
import { HashAndSweep } from './acceleration_structures/HashAndSweep';
import { Anchor } from './Anchor';

class Scene {
  constructor() {
    this.#accelerationStructure = new HashAndSweep();
  }

  get anchors() {
    return this.#anchors;
  }

  addBody(body) {
    this.bodies.push(body);
  }

  removeBody(body) {
    const index = this.bodies.indexOf(body);
    if (index > -1) {
      this.bodies.splice(index, 1);
    }
  }

  findBodyAtPoint(point) {
    return this.bodies.find(body => PointCaster.contains(body.cachedShape, point));
  }

  createAnchor(body, anchorPos) {
    const anchor = new Anchor(body, body.frame.positionToLocal(anchorPos));
    this.#anchors.push(anchor);
    return anchor;
  }

  removeAnchor(anchor) {
    const idx = this.#anchors.findIndex(a => a.id === anchor.id);
    if (idx >= 0) {
      this.#anchors.splice(idx, 1);
    }
  }

  step(dt) {
    this.collisions = [];
    const cycles = 1;
    const dt2 = dt / cycles;

    for (let i = 0; i < cycles; ++i) {
      this.#prepareForNextStep();
      const candidatePairs = this.#broadPhase();
      this.#narrowPhase(candidatePairs);
      this.#updateFrames(dt2);
    }

    this.bodies.forEach(body => body.clearForces());

    this.collisions.forEach(({ a, b, collision }) => {
      a.notifyCollisionsListeners(b, collision);
      b.notifyCollisionsListeners(a, collision);
    });

    this.bodies.forEach(body => body.notifyFrameChangedListeners());
  }

  #prepareForNextStep() {
    this.bodies.forEach(body => {
      body.prepareForNextStep();
    });
  }

  #updateFrames(dt) {
    this.bodies.forEach(body => body.updateFrame(dt / 1000));
  }

  #broadPhase() {
    this.#accelerationStructure.prepare();
    return this.#accelerationStructure.findPairs(this.bodies);
  }

  #narrowPhase(candidatePairs) {
    // Find all pairs of bodies that DO collide
    candidatePairs.forEach(([a, b]) => {
      const collisions = [];
      const worldShapeA = a.cachedShape;
      const worldShapeB = b.cachedShape;

      const overlap = Collider.overlap(worldShapeA, worldShapeB);
      if (!overlap) {
        return;
      }

      const { depth, normal } = overlap;

      const direction = b.frame.position.sub(a.frame.position);
      if (direction.dot(normal) < 0) {
        normal.scaleSelf(-1);
      }

      const contactPoints = Collider.collide(worldShapeA, worldShapeB);
      contactPoints.forEach(point => {
        const collInfo = new CollisionInfo(point, normal);
        const collision = { collision: collInfo, a, b };
        collisions.push(collision);
        this.collisions.push(collision);
      });

      const impulses = collisions.map(({ a, b, collision }) => this.#computeImpulse(a, b, collision)).filter(i => i !== null);
      impulses.forEach(i => {
        this.#applyImpulse(i, impulses.length);
      });

      this.#seperate(a, b, depth, normal);
    });
  }

  /*
  #seperate(a, b, depth, normal) {
    const correction = normal.scale(depth);
    const totalMass = a.mass + b.mass;
    if (a.inverseMass > 0.0) {
      a.frame.position.subToSelf(correction.scale(a.mass / totalMass));
    }
    if (b.inverseMass > 0.0) {
      b.frame.position.addToSelf(correction.scale(b.mass / totalMass));
    }
  }
  */

  #seperate(a, b, depth, normal) {
    const invMassSum = a.inverseMass + b.inverseMass;
    if (invMassSum == 0.0) {
      return;
    }
    const correctionRate = 0.9;
    const correctionLength = (depth / invMassSum) * correctionRate;
    const correctionVector = normal.scale(correctionLength);

    if (a.inverseMass > 0.0) {
      a.frame.position.subToSelf(correctionVector.scale(a.inverseMass));
    }

    if (b.inverseMass > 0.0) {
      b.frame.position.addToSelf(correctionVector.scale(b.inverseMass));
    }
  }

  #applyImpulse({ a, b, rap, rbp, impulse }, count) {
    impulse.scaleSelf(1 / count);
    a.applyImpulse(impulse.scale(-1.0), rap);
    b.applyImpulse(impulse, rbp);
  }

  #computeImpulse(a, b, collision) {
    const { point, normal } = collision;
    const invMassSum = a.inverseMass + b.inverseMass;
    if (invMassSum == 0.0) {
      return null;
    }

    const rap = point.sub(a.frame.position);
    const rbp = point.sub(b.frame.position);

    const rapPerp = rap.tangential();
    const rbpPerp = rbp.tangential();

    const tangentialSpeedVectorA = rapPerp.scale(a.angularVelocity);
    const tangentialSpeedVectorB = rbpPerp.scale(b.angularVelocity);

    const relativeVelocityA = a.linearVelocity.add(tangentialSpeedVectorA);
    const relativeVelocityB = b.linearVelocity.add(tangentialSpeedVectorB);
    const relativeVelocity = relativeVelocityB.sub(relativeVelocityA);

    const relativeVelocityOnNormal = relativeVelocity.dot(normal);
    if (relativeVelocityOnNormal > 0) {
      return null;
    }

    const CoefApCrossNormal = rapPerp.dot(normal);
    const CoefBpCrossNormal = rbpPerp.dot(normal);
    const crossNormalSum =
      CoefApCrossNormal * CoefApCrossNormal * a.inverseInertia + CoefBpCrossNormal * CoefBpCrossNormal * b.inverseInertia;

    const e = Math.min(a.restitution, b.restitution);
    let normalInpulse = -(1 + e) * relativeVelocityOnNormal;
    normalInpulse /= invMassSum + crossNormalSum;
    const normalImpulseVector = normal.scale(normalInpulse);

    let tangent = relativeVelocity.sub(normal.scale(relativeVelocityOnNormal));
    tangent.scaleSelf(-1);

    const CoefApCrossTangent = rapPerp.dot(tangent);
    const CoefBpCrossTangent = rbpPerp.dot(tangent);
    const crossTangentSum =
      CoefApCrossTangent * CoefApCrossTangent * a.inverseInertia + CoefBpCrossTangent * CoefBpCrossTangent * b.inverseInertia;

    const minFriction = Math.min(a.friction, b.friction);
    let tangentialImpulse = -(1 + e) * relativeVelocity.dot(tangent) * minFriction;
    tangentialImpulse /= invMassSum + crossTangentSum;
    if (tangentialImpulse > normalInpulse) {
      tangentialImpulse = normalInpulse;
    }
    const tangentialImpulseVector = tangent.scale(tangentialImpulse);

    const impulse = normalImpulseVector.add(tangentialImpulseVector);
    return { a, b, rap, rbp, impulse };
  }

  #anchors = [];
  bodies = [];
  collisions = [];
  #accelerationStructure;
}

export { Scene };
