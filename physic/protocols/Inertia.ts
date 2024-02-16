import { NotImplementedError, defprotocol } from '../functional.js';

const Inertia = defprotocol('Inertia', {
  compute: (_mass: number): number => {
    throw new NotImplementedError();
  },
});

export { Inertia };
