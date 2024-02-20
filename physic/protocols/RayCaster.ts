import { NotImplementedError, defprotocol } from '../Protocol';
import { Ray, RayIntersection } from '../ray.js';

const RayCaster = defprotocol('RayCaster', {
  cast: (_ray: Ray): RayIntersection[] => {
    throw new NotImplementedError();
  },
});

export { RayCaster };
