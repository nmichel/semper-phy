import { defimpl } from './functional.js';
import { PointCaster, RayCaster, Render, Transformer } from './protocols/protocols.js';
import { RayIntersection } from './ray.js';
import { RigidBody } from './rigidbody.js';

defimpl(Render, RigidBody, {
  render: (rigidbody, ctxt, opts): undefined => {
    const worldShape = Transformer.toWorld(rigidbody.shape, rigidbody.frame);
    Render.render(worldShape, ctxt, opts);
    Render.render(rigidbody.frame, ctxt, opts);
    Render.render(rigidbody.aabb, ctxt, opts);
  }
});

defimpl(RayCaster, RigidBody, {
  cast: (rigidbody, ray): RayIntersection[] => {
    const localRay = Transformer.toLocal(ray, rigidbody.frame);
    return RayCaster.cast(rigidbody.shape, localRay).map(c => Transformer.toWorld(c, rigidbody.frame));
  }
});

defimpl(PointCaster, RigidBody, {
  contains: (rigidbody, point): boolean => {
    const localPoint = rigidbody.frame.positionToLocal(point);
    return PointCaster.contains(rigidbody.shape, localPoint);
  }
});
