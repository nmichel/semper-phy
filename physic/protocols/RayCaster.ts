import { NotImplementedError, defprotocol } from '../Protocol';
import { Ray, RayIntersection } from '../Ray';

const RayCaster = defprotocol('RayCaster', {
  cast: (_ray: Ray): RayIntersection[] => {
    throw new NotImplementedError();
  },
});

export { RayCaster };
