import { Circle } from '../circle.js';
import { AABB } from '../aabb.js';
import { RigidBody } from '../rigidbody.js';
import { Scene } from '../scene.js';
import { toRadians, Vector2 } from '../math.js';

export default function buildScene() {
  const scene = new Scene();
  scene.addBody(new RigidBody(0, new Vector2(800, 20), new AABB(1400, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(800, 900), new AABB(1400, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(75, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(1530, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));

  const radius = 40;
  const mass = radius * radius * Math.PI * 0.01;
  const yPos = 450;
  
  const triangleHeight = 5;
  const angle = toRadians(30);
  const c = Math.cos(angle) * radius * 2;
  const s = Math.sin(angle) * radius * 2;
  const iStep = new Vector2(c, -s);
  const jStep = new Vector2(c, s);
  const origin = new Vector2(800, yPos);
  for (let i = 0; i < triangleHeight; ++i) {
    const base = iStep.scale(i).add(origin);
    for (let j = 0; j < triangleHeight - i; ++j) {
      const pos = base.add(jStep.scale(j));
      scene.addBody(new RigidBody(0, pos, new Circle(radius), new Vector2(), 0, mass));
    }
  }
  
  scene.addBody(new RigidBody(0, new Vector2(400, yPos), new Circle(radius), new Vector2(), 0, mass));

  return scene;
}
