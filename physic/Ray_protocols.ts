import { defimpl } from './Protocol';
import { Cloner, Render, Transformer } from './protocols/protocols.js';
import { Ray, RayIntersection } from './Ray';
import * as GfxTools from './GfxUtils';
import { Vector2 } from './Math.js';
import { Frame } from './Frame';

defimpl(Render, Ray, {
  render: (ray: Ray, ctxt): undefined => {
    GfxTools.drawLine(ctxt, ray.origin.sub(ray.direction.scale(1000)), ray.origin.add(ray.direction.scale(2000)), {
      strokeStyle: 'yellow',
      lineDash: [5, 5],
    });
    GfxTools.drawVector(ctxt, ray.origin, ray.origin.add(ray.direction.scale(100)), { strokeStyle: 'yellow' });
    GfxTools.drawDisc(ctxt, ray.origin.x, ray.origin.y, 2, { strokeStyle: 'yellow' });
  },
});

defimpl(Transformer, Ray, {
  toLocal: (ray: Ray, frame: Frame): Ray => {
    return new Ray(frame.positionToLocal(ray.origin), frame.directionToLocal(ray.direction));
  },
  toWorld: function (_ray: Ray, _frame: Frame): Ray {
    throw new Error('Function not implemented.');
  },
});

defimpl(Cloner, Ray, {
  clone: (ray: Ray): Ray => {
    return new Ray(new Vector2(ray.origin.x, ray.origin.y), new Vector2(ray.direction.x, ray.direction.y));
  },
});

defimpl(Render, RayIntersection, {
  render: (collision: RayIntersection, ctxt): undefined => {
    GfxTools.drawVector(ctxt, collision.point, collision.point.add(collision.normal.scale(30)), { strokeStyle: 'blue' });
    GfxTools.drawDisc(ctxt, collision.point.x, collision.point.y, 3, { strokeStyle: 'orange' });
  },
});

defimpl(Transformer, RayIntersection, {
  toWorld: (collision: RayIntersection, frame): RayIntersection => {
    return new RayIntersection(frame.positionToWorld(collision.point), frame.directionToWorld(collision.normal), collision.t);
  },
  toLocal: function (_obj: RayIntersection, _frame: Frame): RayIntersection {
    throw new Error('Function not implemented.');
  },
});

defimpl(Cloner, RayIntersection, {
  clone: ({ point, normal, t }): RayIntersection => {
    return new RayIntersection(new Vector2(point.x, point.y), new Vector2(normal.x, normal.y), t);
  },
});
