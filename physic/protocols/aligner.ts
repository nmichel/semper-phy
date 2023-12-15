import { defprotocol, NotImplementedError } from '../functional.js';
import { AABB } from '../aabb.js';
import { Frame } from '../frame.js';

const Aligner = defprotocol('Aligner', {
  computeAABB: (frame: Frame): AABB => {
    throw new NotImplementedError();
  },
});

export { Aligner };
