import { Circle } from '../../circle.js';
import { buildCircleContainedPolygon } from '../../geom.js';
import { Box } from '../../box.js';
import { RigidBody } from '../../rigidbody.js';
import { Scene } from '../../scene.js';
import { Vector2 } from '../../math.js';

export default function buildScene() {
  const scene = new Scene();
  scene.addBody(new RigidBody(0, new Vector2(800, 600), new Box(1400, 20), new Vector2(0, 0), 0, 0));

  const angle = Math.random() * 90;
  const radius = 30.0 + Math.random() * 40;
  const linearSpeed = new Vector2(0, 0);
  const angularSpeed = 0;
  scene.addBody(new RigidBody(angle, new Vector2(800, 200), new Circle(radius), linearSpeed, angularSpeed, radius*radius));
  // const verts = Math.round(3 + Math.random() * 5);
  // scene.addBody(new RigidBody(angle, new Vector2(800 + (j - 2) * 200, 200 + i * 150), buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), new Vector2(0, - Math.sign(i - 2) * 50), angularSpeed, radius*radius));

  return scene;
}
