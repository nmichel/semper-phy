import { defprotocol } from './functional.js';

const Collider = defprotocol('Collider', ['collide']);
const PointCaster = defprotocol('PointCaster', ['contains']);
const PolygonCollider = defprotocol('PolygonCollider', ['collide']);
const Render = defprotocol('Render', ['render']);
const RayCaster = defprotocol('RayCaster', ['cast']);
const Transformer = defprotocol('Transformer', ['toLocal', 'toWorld']);

export { Collider, PointCaster, PolygonCollider, RayCaster, Render, Transformer };
