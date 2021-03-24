import { defprotocol } from '../functional.js';

const Transformer = defprotocol('Transformer', ['toLocal', 'toWorld']);
  
export { Transformer };
