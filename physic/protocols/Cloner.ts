import { NotImplementedError, defprotocol } from '../Protocol';

const Cloner = defprotocol('Cloner', {
  clone: <T>(): T => {
    throw new NotImplementedError();
  },
});

export { Cloner };
