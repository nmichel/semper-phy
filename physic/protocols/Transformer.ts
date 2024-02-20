import { Frame } from '../Frame';
import { NotImplementedError, defprotocol } from '../Protocol';

const Transformer = defprotocol('Transformer', {
  toLocal: (_frame: Frame): any => {
    throw new NotImplementedError();
  },
  toWorld: (_frame: Frame): any => {
    throw new NotImplementedError();
  },
});

export { Transformer };
