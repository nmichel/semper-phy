import { NotImplementedError, defprotocol } from '../functional.js';

const Cloner = defprotocol('Cloner', {
  clone: <T>(): T => { throw new NotImplementedError(); }
});

export { Cloner };
