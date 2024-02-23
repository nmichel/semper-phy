import { NotImplementedError, defprotocol } from '../Protocol';

export type Options = {
  debug: {
    enabled?: boolean;
    showAABB?: boolean;
    showFrame?: boolean;
    showEdges?: boolean;
    showVertices?: boolean;
    showNormals?: boolean;
    showTrail?: boolean;
  };
};

const Render = defprotocol('Render', {
  render: (_ctxt: CanvasRenderingContext2D, opts?: Options): undefined => {
    throw new NotImplementedError();
  },
});

export { Render };
