import { defprotocol } from './functional.js';

const PointCaster = defprotocol('PointCaster', ['contains']);
const Render = defprotocol('Render', ['render']);
const RayCaster = defprotocol('RayCaster', ['cast']);
const Transformer = defprotocol('Transformer', ['toLocal', 'toWorld']);

export { PointCaster, RayCaster, Render, Transformer };
