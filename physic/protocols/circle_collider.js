import { defprotocol } from '../functional.js';

const CircleCollider = defprotocol('CircleCollider', ['overlap', 'collide']);

export { CircleCollider };
