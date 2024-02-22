import { defprotocol, NotImplementedError } from '../Protocol';
import { AABB } from '../AABB.js';
import { Frame } from '../Frame';

const Aligner = defprotocol('Aligner', {
  computeAABB: (frame: Frame | null): AABB => {
    throw new NotImplementedError();
  },
});

export { Aligner };
