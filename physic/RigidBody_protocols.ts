import { defimpl } from './Protocol';
import { PointCaster, RayCaster, Render, Transformer } from './protocols/protocols.js';
import { RayIntersection } from './ray.js';
import { RigidBody } from './Rigidbody.js';

defimpl(Render, RigidBody, {
  render: (rigidbody: RigidBody, ctxt, opts): undefined => {
    Render.render(rigidbody.cachedShape, ctxt, opts);

    rigidbody.anchors.forEach(anchor => {
      const transformedAnchor = Transformer.toWorld(anchor, rigidbody.frame);
      Render.render(transformedAnchor, ctxt, opts);
    });

    if (opts?.debug?.enabled === true) {
      if (opts?.debug?.showFrame === true) {
        Render.render(rigidbody.frame, ctxt, opts);
      }
      if (opts?.debug?.showAABB === true) {
        Render.render(rigidbody.aabb, ctxt, opts);
      }
    }
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
