import { defprotocol } from '../functional.js';

const Aligner = defprotocol('Aligner', ['computeAABB']);

export { Aligner };
