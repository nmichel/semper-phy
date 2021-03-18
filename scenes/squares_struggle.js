import { AABB } from '../aabb.js';
import { Circle } from '../circle.js';
import { RigidBody } from '../rigidbody.js';
import { Scene } from '../scene.js';
import { Vector2 } from '../math.js';

export default function buildScene() {
  const scene = new Scene();
  scene.addBody(new RigidBody(0, new Vector2(800, 20), new AABB(1430, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(800, 900), new AABB(1430, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(75, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(1525, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));

  const splitOrCreate = function(x, y, w, h) {
    if (w < 100 || h < 100 || w * h < 200 || Math.random() < 0.3) {
      const scalarVelocity = 20;
      const linearSpeed = new Vector2(Math.random() * scalarVelocity - scalarVelocity/2, Math.random() * scalarVelocity - scalarVelocity/2);
      const angularSpeed = Math.random() * 10 - 5;
      scene.addBody(new RigidBody(0, new Vector2(x + w / 2, y + h / 2), new AABB(w*0.9, h*0.9), linearSpeed, angularSpeed, h * w));
    }
    else {
      const hw = Math.round(Math.random() * w);
      const lw = w - hw;
      const hh = Math.round(Math.random() * h);
      const lh = h - hh;
      splitOrCreate(x, y, hw, hh);
      splitOrCreate(x + hw, y, lw, hh);
      splitOrCreate(x, y + hh, hw, lh);
      splitOrCreate(x + hw, y + hh, lw, lh);
    }
  }

  splitOrCreate(100, 100, 1400, 750);

  return scene;
}
