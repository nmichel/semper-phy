import { NotImplementedError, defprotocol } from '../functional.js';

const Render = defprotocol('Render', {
  render: (_ctxt: CanvasRenderingContext2D, opts?: any): undefined => {
    throw new NotImplementedError();
  },
});

export { Render };
