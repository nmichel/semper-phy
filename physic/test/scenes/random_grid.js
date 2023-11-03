import { Circle } from '../../circle.js';
import { buildCircleContainedPolygon } from '../../geom.js';
import { Box } from '../../box.js';
import { RigidBody } from '../../rigidbody.js';
import { Scene } from '../../scene.js';
import { Vector2 } from '../../math.js';

export default function buildScene() {
  const scene = new Scene();
  scene.addBody(new RigidBody(0, new Vector2(800, 20), new Box(1400, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(800, 900), new Box(1400, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(75, 460), new Box(20, 900), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(1530, 460), new Box(20, 900), new Vector2(0, 0), 0, 0));

/*   const angle = Math.random() * 90;
  const radius = 30.0 + Math.random() * 40;
  const scalarVelocity = 140;
  const linearSpeed = new Vector2(Math.random() * scalarVelocity - scalarVelocity/2, Math.random() * scalarVelocity - scalarVelocity/2);
  const angularSpeed = Math.random() * 36;

//  scene.addBody(new RigidBody(0, new Vector2(800, 200), new Circle(50), new Vector2(1, 0), 0, 50*50));
  const verts = Math.round(3 + Math.random() * 5);
  scene.addBody(new RigidBody(angle, new Vector2(800, 200), buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), new Vector2(0, -10), angularSpeed, radius*radius));
 */

  for (let j  = 0; j < 5; ++j) {
    for (let i  = 0; i < 5; ++i) {
      const angle = Math.random() * 90;
      const radius = 30.0 + Math.random() * 40;
      const scalarVelocity = 140;
      const linearSpeed = new Vector2(Math.random() * scalarVelocity - scalarVelocity/2, Math.random() * scalarVelocity - scalarVelocity/2);
      const angularSpeed = Math.random() * 36;
      if (Math.random() > 0.5) {
        scene.addBody(new RigidBody(angle, new Vector2(800 + (j - 2) * 200, 200 + i * 150), new Circle(radius), linearSpeed, angularSpeed, radius*radius));
      }
      else {
        const verts = Math.round(3 + Math.random() * 5);
        scene.addBody(new RigidBody(angle, new Vector2(800 + (j - 2) * 200, 200 + i * 150), buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), new Vector2(0, - Math.sign(i - 2) * 50), angularSpeed, radius*radius));
      }
    }
  }

  return scene;
}
