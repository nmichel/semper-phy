export type pair = [number, number];

export type RigidBody = any;

export interface AccelerationStructure {
  prepare(): void;

  findPairs(bodies: RigidBody[]): pair[];
}
