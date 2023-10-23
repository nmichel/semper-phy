import { defprotocol } from '../functional.js';

const PolygonCollider = defprotocol('PolygonCollider', ['overlap', 'collide']);

export { PolygonCollider };
