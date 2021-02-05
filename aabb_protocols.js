import { defimpl } from './functional.js';
import { AABB } from './aabb.js';
import { Polygon } from './geom.js';
import { RayCaster, Render } from './protocols.js';
import { RayIntersection } from './ray.js';
import { Vector2 } from './math.js';

defimpl(RayCaster, AABB, 'cast', (aabb, ray) => {
  // Code and explanation (especially on how to handle infinite slopes): https://tavianator.com/2011/ray_box.html

  const min = aabb.halfSize.scale(-1.0);
  const max = aabb.halfSize;

  const rayDirectionInv = new Vector2(1.0 / ray.direction.x, 1.0 / ray.direction.y);

  const tx1 = (min.x - ray.origin.x)*rayDirectionInv.x;
  const tx2 = (max.x - ray.origin.x)*rayDirectionInv.x;

  let tmin = Math.min(tx1, tx2);
  let tmax = Math.max(tx1, tx2);

  const ty1 = (min.y - ray.origin.y)*rayDirectionInv.y;
  const ty2 = (max.y - ray.origin.y)*rayDirectionInv.y;

  tmin = Math.max(tmin, Math.min(ty1, ty2));
  tmax = Math.min(tmax, Math.max(ty1, ty2));

  if (tmax < tmin) {
    return [];
  }
  else {
    // TODO handle special case where tmax-tmin < epsilon (one interesection)
    const result = [];
    if (tmin > 0) {
      result.push(ray.getPointAtCoef(tmin));
    }
    if (tmax > 0) {
      result.push(ray.getPointAtCoef(tmax));
    }
    return result;
  }
});

defimpl(Render, AABB, 'render', (aabb, ctxt, opts) => {
  const { frame } = opts;
  const {x, y} = aabb.halfSize;
  const polygon = new Polygon([
    frame.positionToWorld(new Vector2(x, y)),
    frame.positionToWorld(new Vector2(-x, y)),
    frame.positionToWorld(new Vector2(-x, -y)),
    frame.positionToWorld(new Vector2(x, -y))
  ]);
  Render.render(polygon, ctxt, opts);
});
