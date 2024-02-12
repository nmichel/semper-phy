import { AccelerationStructure, RigidBody, pair } from './AccelerationStructure';

class RigidBodySweepHash {
  reset(): void {
    this.#hash = {};
  }

  add(bodyA: RigidBody, bodyB: RigidBody): void {
    this.#hash[this.#hashKey(bodyA, bodyB)] = true;
  }

  exists(bodyA: RigidBody, bodyB: RigidBody): boolean {
    return this.#hash[this.#hashKey(bodyA, bodyB)];
  }

  #hashKey(bodyA: RigidBody, bodyB: RigidBody): number {
    const aId = Math.min(bodyA.id, bodyB.id);
    const bId = Math.max(bodyA.id, bodyB.id);
    const hash = this.#pairing(aId, bId);
    return hash;
  }

  // Pairing function
  // Borrowed from http://szudzik.com/ElegantPairing.pdf
  // Works with non négative integers
  //
  // When used with pair of bodies, ensure that
  // - the smallest body id is always the first argument
  // - ids are always different
  #pairing(idA: RigidBody, idB: RigidBody): number {
    // /!\ Not needed as we require that a < b
    //
    // if (idA >= idB) {
    //   return idA * idA + idA + idB;
    // }

    return idB * idB + idA;
  }

  #hash: { [key: number]: boolean } = {};
}

export class HashAndSweep implements AccelerationStructure {
  constructor() {
    this.#hash = new RigidBodySweepHash();
  }

  prepare(): void {
    this.#hash.reset();
  }

  findPairs(bodies: RigidBody): pair[] {
    // Sort the bodies by their x position
    bodies.sort((a, b) => a.aabb.min.x - b.aabb.min.x);

    // Find all pairs of bodies that MAY collide
    const [pairsX] = bodies.reduce(
      (acc, body) => {
        const [pairs, stack] = acc;
        if (stack.length == 0) {
          stack.push(body);
        } else {
          // Pop bodies out of the stack that are not overlapping the current body
          let posInStack = 0;
          while (posInStack < stack.length) {
            if (stack[posInStack].aabb.max.x < body.aabb.min.x) {
              stack.splice(posInStack, 1);
            } else {
              posInStack++;
            }
          }

          // All remaining bodies in the stack are overlapping the current body
          // and MAY collide with it.
          // Store the pair in a hashmap indexed by the pair hash
          stack.forEach(b => {
            if (b.collisionFlags & body.collisionMask && body.collisionFlags & b.collisionMask) {
              this.#hash.add(body, b);
              pairs.push([body, b]);
            }
          });

          // Stack the current body
          stack.push(body);
        }
        return acc;
      },
      [[], []]
    );

    // Sort the bodies by their y position
    bodies.sort((a, b) => a.aabb.min.y - b.aabb.min.y);

    // Find all pairs of bodies that MAY collide along the y axis
    // and that are also in the hashmap
    const [pairs] = bodies.reduce(
      (acc, body) => {
        const [pairs, stack] = acc;
        if (stack.length == 0) {
          stack.push(body);
        } else {
          // Pop bodies out of the stack that are not overlapping the current body
          let posInStack = 0;
          while (posInStack < stack.length) {
            if (stack[posInStack].aabb.max.y < body.aabb.min.y) {
              stack.splice(posInStack, 1);
            } else {
              posInStack++;
            }
          }

          // All remaining bodies in the stack are overlapping the current body
          // and MAY collide with it.
          // We check if they are in the hashmap, to ensure that we only keep
          // pairs that MAY collide in both axis.
          stack.forEach(b => {
            if (b.collisionFlags & body.collisionMask && body.collisionFlags & b.collisionMask && this.#hash.exists(body, b)) {
              pairs.push([body, b]);
            }
          });

          // Stack the current body
          stack.push(body);
        }
        return acc;
      },
      [[], []]
    );

    return pairs;
  }

  #hash: RigidBodySweepHash;
}
