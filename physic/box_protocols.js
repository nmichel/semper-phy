import { Inertia } from './protocols/inertia.js';
import { defimpl } from './functional.js';
import { Box } from './box.js';
import { Polygon } from './geom.js';
import { Aligner, PointCaster, RayCaster, Transformer } from './protocols/protocols.js';
import { RayIntersection } from './ray.js';
import { Vector2 } from './math.js';
import { AABB } from './aabb.js';

defimpl(RayCaster, Box, 'cast', (box, ray) => {
  // Code and explanation (especially on how to handle infinite slopes): https://tavianator.com/2011/ray_box.html

  const min = box.halfSize.scale(-1.0);
  const max = box.halfSize;

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
      const point = ray.getPointAtCoef(tmin);
      const normal = box.findNormal(point);
      const col = new RayIntersection(point, normal, tmin);
      result.push(col);
    }
    if (tmax > 0) {
      const point = ray.getPointAtCoef(tmax);
      const normal = box.findNormal(point);
      const col = new RayIntersection(point, normal, tmax);
      result.push(col);
    }
  
    return result;
  }
});

defimpl(Transformer, Box, 'toWorld', (box, frame) => {
  const {x, y} = box.halfSize;
  return new Polygon([
    frame.positionToWorld(new Vector2(x, y)),
    frame.positionToWorld(new Vector2(-x, y)),
    frame.positionToWorld(new Vector2(-x, -y)),
    frame.positionToWorld(new Vector2(x, -y))
  ]);
});

defimpl(PointCaster, Box, 'contains', (box, point) => {
  const absPoint = point.abs();
  return box.halfSize.x >= absPoint.x && box.halfSize.y >= absPoint.y;
});

defimpl(Inertia, Box, 'compute', ({ size: { x: width, y: height } }, mass) => {
  return 1/12 * mass * (height * height + width * width);
});

defimpl(Aligner, Box, 'computeAABB', (box, frame) => {
  const shape = Transformer.toWorld(box, frame);
  return shape.vertices.reduce((aabb, v) => {
    return aabb.update(v);
  }, new AABB());
});
