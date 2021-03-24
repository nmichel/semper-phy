import { AABB } from '../aabb.js';
import { Circle } from '../circle.js';
import { RigidBody } from '../rigidbody.js';
import { Scene } from '../scene.js';
import { Vector2 } from '../math.js';

export default function buildScene() {
  const scene = new Scene();
  scene.addBody(new RigidBody(0, new Vector2(800, 20), new AABB(1400, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(800, 900), new AABB(1400, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(75, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(1530, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));

  for (let j  = 0; j < 5; ++j) {
    for (let i  = 0; i < 5; ++i) {
      scene.addBody(new RigidBody(0, new Vector2(800 + (j - 2) * 200, 150 + i * 150), new AABB(70, 70), new Vector2(), 20, 0));
    }
  }

  const angle = Math.random() * 90;
  const radius = 20.0;
  const scalarVelocity = 240;
  const linearSpeed = new Vector2(Math.random() * scalarVelocity - scalarVelocity/2, Math.random() * scalarVelocity - scalarVelocity/2);
  const angularSpeed = Math.random() * 36;
  scene.addBody(new RigidBody(angle, new Vector2(200, 200), new Circle(radius), linearSpeed, angularSpeed, radius*radius));

  return scene;
}
