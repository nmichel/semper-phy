import { NotImplementedError, defprotocol } from '../Protocol';

const Render = defprotocol('Render', {
  render: (_ctxt: CanvasRenderingContext2D, opts?: any): undefined => {
    throw new NotImplementedError();
  },
});

export { Render };
