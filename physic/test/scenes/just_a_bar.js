import { AABB } from '../../aabb.js';
import { RigidBody } from '../../rigidbody.js';
import { Scene } from '../../scene.js';
import { Vector2 } from '../../math.js';

export default function buildScene() {
  const scene = new Scene();
  scene.addBody(new RigidBody(0, new Vector2(800, 20), new AABB(1400, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(800, 900), new AABB(1400, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(75, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(1530, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(800, 400), new AABB(400, 20), new Vector2(0, 0), 0, 1000));
  return scene;
}
