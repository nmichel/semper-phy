import { defprotocol } from '../functional.js';

const CircleCollider = defprotocol('CircleCollider', ['collide']);
const Collider = defprotocol('Collider', ['collide']);
const PointCaster = defprotocol('PointCaster', ['contains']);
const PolygonCollider = defprotocol('PolygonCollider', ['collide']);
const Render = defprotocol('Render', ['render']);
const RayCaster = defprotocol('RayCaster', ['cast']);
const Transformer = defprotocol('Transformer', ['toLocal', 'toWorld']);

class CollisionInfo {
  // constructor(Vector2, Vector2, Number) -> CollisionInfo
  constructor(point, normal, magnitude) {
    this.point = point
    this.normal = normal
    this.magnitude = magnitude
  }
}
  
export { CollisionInfo, CircleCollider, Collider, PointCaster, PolygonCollider, RayCaster, Render, Transformer };
