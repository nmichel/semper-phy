import { Collider, Transformer } from './protocols/protocols.js';
import { toRadians } from './math.js';

class Scene {
  constructor() {
    this.bodies = [];
    this.collisions = [];
  }

  addBody(body) {
    this.bodies.push(body);
  }

  step(dt) {
    this.collisions = [];

    for (let i = 0; i < this.bodies.length; ++i) {
      const a = this.bodies[i];
      for (let j = i+1; j < this.bodies.length; ++j) {
        if (i === j) {
          continue;
        }
  
        const b = this.bodies[j];
        const worldShapeA = Transformer.toWorld(a.shape, a.frame);
        const worldShapeB = Transformer.toWorld(b.shape, b.frame);
        
        Collider.collide(worldShapeA, worldShapeB)
        .forEach(collision => this.collisions.push({ collision, a, b }));
      }
    }
  
    this.collisions.forEach(({ a, b, collision }) => this.applyImpulse(a, b, collision));
    this.bodies.forEach(body => body.updateFrame(dt / 1000));
  }

  applyImpulse(a, b, collision) {
    const { point, normal, magnitude } = collision;
    const invMassSum = a.inverseMass + b.inverseMass;
    if (invMassSum == 0.0) {
      return;
    }
    const relativeNormal = normal.clone();
    if (b.frame.position.sub(a.frame.position).dot(relativeNormal) < 0) {
      relativeNormal.scaleSelf(-1)
    }

    const rap = point.sub(a.frame.position);
    const rbp = point.sub(b.frame.position);
    const rapPerp = rap.tangential();
    const rbpPerp = rbp.tangential();
    const tangentialSpeedVectorA = rapPerp.scale(toRadians(a.angularVelocity));
    const tangentialSpeedVectorB = rbpPerp.scale(toRadians(b.angularVelocity));
    const relativeVelocity = b.linearVelocity.add(tangentialSpeedVectorB).sub(a.linearVelocity.add(tangentialSpeedVectorA));
  
    const relativeVelocityOnNormal = relativeVelocity.dot(relativeNormal);
    if (relativeVelocityOnNormal > 0) {
      return;
    }  
  
    const CoefApCrossN = rapPerp.dot(relativeNormal)
    const CoefBpCrossN = rbpPerp.dot(relativeNormal)
    const e = Math.min(a.restitution, b.restitution);
    const numerator = -(1 + e) * relativeVelocityOnNormal;
    const denominator = invMassSum + (CoefApCrossN * CoefApCrossN * a.inverseInertia) + (CoefBpCrossN * CoefBpCrossN * b.inverseInertia);
    const j = numerator / denominator;
    const impulse = relativeNormal.scale(j);
  
    a.applyImpulse(impulse.scale(-1.0), rap);
    b.applyImpulse(impulse, rbp);
  
    // Positionnal correction
    // 
    const percent = 0.2 // usually 20% to 80%
    const slop = 0.01 // usually 0.01 to 0.1
    const correction = normal.scale(Math.max(magnitude - slop, 0.0) / invMassSum * percent);
    a.frame.position.subToSelf(correction.scale(a.inverseMass));
    b.frame.position.addToSelf(correction.scale(b.inverseMass));
  }
}

export { Scene };
