import { defprotocol } from './functional.js';

const Render = defprotocol(['render']);
const RayCaster = defprotocol(['cast']);
const Transformer = defprotocol(['toLocal', 'toWorld']);

export { RayCaster, Render, Transformer };
