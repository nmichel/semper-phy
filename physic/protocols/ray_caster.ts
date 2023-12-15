import { NotImplementedError, defprotocol } from '../functional.js';
import { Ray, RayIntersection } from '../ray.js';

const RayCaster = defprotocol('RayCaster', {
  cast: (_ray: Ray): RayIntersection[] => {
    throw new NotImplementedError();
  },
});

export { RayCaster };
