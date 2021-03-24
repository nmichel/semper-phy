import { defprotocol } from '../functional.js';

const PointCaster = defprotocol('PointCaster', ['contains']);
  
export { PointCaster };
