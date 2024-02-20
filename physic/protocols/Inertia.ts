import { NotImplementedError, defprotocol } from '../Protocol';

const Inertia = defprotocol('Inertia', {
  compute: (_mass: number): number => {
    throw new NotImplementedError();
  },
});

export { Inertia };
