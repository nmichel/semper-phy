import { CollisionInfo, Collider, Transformer } from './protocols/protocols.js';
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
    const cycles = 10;
    const dt2 = dt / cycles;

    for (let i = 0; i < cycles; ++i) {
      this.bodies.forEach(body => body.updateFrame(dt2 / 1000));

      // Sort the bodies by their x position
      this.bodies.sort((a, b) => a.aabb.min.x - b.aabb.min.x);

      // Find all pairs of bodies that MAY collide
      const [pairs] =
        this.bodies.reduce((acc, body) => {
          const [pairs, stack] = acc;
          if (stack.length == 0) {
            stack.push(body);
          } else {
            // Pop bodies out of the stack that are not overlapping the current body
            let posInStack = 0;
            while (posInStack < stack.length) {
              if (stack[posInStack].aabb.max.x < body.aabb.min.x) {
                stack.splice(posInStack, 1);
              }
              else {
                posInStack++;
              }
            }

            // All remaining bodies in the stack are overlapping the current body
            // and MAY collide with it
            stack.forEach(b => {
              pairs.push([body, b]);
            })

            // Stack the current body 
            stack.push(body);
          }
          return acc;
        }, [[], []]);

      // Find all pairs of bodies that DO collide
      pairs.forEach(([a, b]) => {
        const collisions = [];    
        const worldShapeA = Transformer.toWorld(a.shape, a.frame);
        const worldShapeB = Transformer.toWorld(b.shape, b.frame);
  
        const overlap = Collider.overlap(worldShapeA, worldShapeB)
        if (overlap) {
          const {depth,  normal} = overlap
  
          const direction = b.frame.position.sub(a.frame.position)
          if (direction.dot(normal) < 0) {
            normal.scaleSelf(-1)
          }
  
          const correction =  normal.scale(depth);
          const totalMass = a.mass + b.mass;
          if (a.inverseMass > 0.0) {
            a.frame.position.subToSelf(correction.scale(a.mass / totalMass))
          }
          if (b.inverseMass > 0.0) {
            b.frame.position.addToSelf(correction.scale(b.mass / totalMass))
          }
  
          const contactPoints = Collider.collide(worldShapeA, worldShapeB)
          contactPoints.forEach(point => {
            const collInfo = new CollisionInfo(point,  normal)
            const collision = { collision: collInfo, a, b };
            collisions.push(collision)
            this.collisions.push(collision)
          });
  
          const impulses = collisions.map(({ a, b, collision }) => this.computeImpulse(a, b, collision));
          impulses.forEach(i => {if (i) this.applyImpulse(i, impulses.length)});
        }
      });
    }
  }

  applyImpulse({a, b, rap, rbp, impulse}, count) {
    impulse.scaleSelf(1./count)
    a.applyImpulse(impulse.scale(-1.0), rap);
    b.applyImpulse(impulse, rbp);
  }

  computeImpulse(a, b, collision) {
    const { point,  normal } = collision;
    const invMassSum = a.inverseMass + b.inverseMass;
    if (invMassSum == 0.0) {
      return null;
    }

    const rap = point.sub(a.frame.position);
    const rbp = point.sub(b.frame.position);
    // console.log('rap rbp', rap, rbp)
    const rapPerp = rap.tangential();
    const rbpPerp = rbp.tangential();
    // console.log('rapPerp rbpPerp', rapPerp, rbpPerp)
    const tangentialSpeedVectorA = rapPerp.scale(toRadians(a.angularVelocity));
    const tangentialSpeedVectorB = rbpPerp.scale(toRadians(b.angularVelocity));
    // console.log('tangentialSpeedVectorA', tangentialSpeedVectorA)
    // console.log('tangentialSpeedVectorB', tangentialSpeedVectorB)
    const relativeVelocity = b.linearVelocity.add(tangentialSpeedVectorB).sub(a.linearVelocity.add(tangentialSpeedVectorA));
    // console.log('relativeVelocity', relativeVelocity)

    const relativeVelocityOnNormal = relativeVelocity.dot(normal);
    if (relativeVelocityOnNormal > 0) {
      return null;
    }  

    // console.log('relativeVelocityOnNormal', relativeVelocityOnNormal)
  
    const CoefApCrossN = rapPerp.dot(normal)
    const CoefBpCrossN = rbpPerp.dot(normal)
    // console.log("CoefApCrossN CoefBpCrossN ", CoefApCrossN, CoefBpCrossN)
    const e = Math.min(a.restitution, b.restitution);
    const numerator = -(1 + e) * relativeVelocityOnNormal;
    // console.log("numerator", numerator)
    const denominator = invMassSum + (CoefApCrossN * CoefApCrossN * a.inverseInertia) + (CoefBpCrossN * CoefBpCrossN * b.inverseInertia);
    // console.log("denominator", denominator)
    const j = numerator / denominator;
    const impulse = normal.scale(j);

    // console.log('impulse', impulse)

    return {a, b, rap, rbp, impulse}
  }
}

export { Scene };
