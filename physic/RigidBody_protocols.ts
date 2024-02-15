import { defimpl } from './functional.js';
import { PointCaster, RayCaster, Render, Transformer } from './protocols/protocols.js';
import { RayIntersection } from './ray.js';
import { RigidBody } from './Rigidbody.js';

defimpl(Render, RigidBody, {
  render: (rigidbody: RigidBody, ctxt, opts): undefined => {
    const worldShape = Transformer.toWorld(rigidbody.shape, rigidbody.frame);
    Render.render(worldShape, ctxt, opts);
    Render.render(rigidbody.frame, ctxt, opts);
    // Render.render(rigidbody.aabb, ctxt, opts);
  },
});

defimpl(RayCaster, RigidBody, {
  cast: (rigidbody: RigidBody, ray): RayIntersection[] => {
    const localRay = Transformer.toLocal(ray, rigidbody.frame);
    return RayCaster.cast(rigidbody.shape, localRay).map(c => Transformer.toWorld(c, rigidbody.frame));
  },
});

defimpl(PointCaster, RigidBody, {
  contains: (rigidbody: RigidBody, point): boolean => {
    const localPoint = rigidbody.frame.positionToLocal(point);
    return PointCaster.contains(rigidbody.shape, localPoint);
  },
});
