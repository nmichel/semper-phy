import { defprotocol } from './functional.js';

const Render = defprotocol('Render', ['render']);
const RayCaster = defprotocol('RayCaster', ['cast']);
const Transformer = defprotocol('Transformer', ['toLocal', 'toWorld']);

export { RayCaster, Render, Transformer };
