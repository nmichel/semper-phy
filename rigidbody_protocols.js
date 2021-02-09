import { defimpl } from './functional.js';
import { RayCaster, Render, Transformer } from './protocols.js';
import { RigidBody } from './rigidbody.js';

defimpl(Render, RigidBody, 'render', (rigidbody, ctxt, opts) => {
  const worldShape = Transformer.toWorld(rigidbody.shape, rigidbody.frame);
  Render.render(worldShape, ctxt, opts);
  Render.render(rigidbody.frame, ctxt, opts);
});

defimpl(RayCaster, RigidBody, 'cast', (rigidbody, ray) => {
  const localRay = Transformer.toLocal(ray, rigidbody.frame);
  return RayCaster.cast(rigidbody.shape, localRay).map(c => Transformer.toWorld(c, rigidbody.frame));
});
