import { Box } from '../../aabb.js';
import { RigidBody } from '../../rigidbody.js';
import { Scene } from '../../scene.js';
import { Vector2 } from '../../math.js';

export default function buildScene() {
  const scene = new Scene();
  // scene.addBody(new RigidBody(0, new Vector2(800, 20), new Box(1400, 20), new Vector2(0, 0), 0, 0));
  scene.addBody(new RigidBody(0, new Vector2(800, 900), new Box(1400, 20), new Vector2(0, 0), 0, 0));
  // scene.addBody(new RigidBody(0, new Vector2(75, 460), new Box(20, 900), new Vector2(0, 0), 0, 0));
  // scene.addBody(new RigidBody(0, new Vector2(1530, 460), new Box(20, 900), new Vector2(0, 0), 0, 0));

  // scene.addBody(new RigidBody(0, new Vector2(800, 400), new Box(100, 100), new Vector2(0, 0), 0, 1000));


  scene.addBody(new RigidBody(0, new Vector2(500, 500), new Box(100, 20), new Vector2(0, 0), 0, 1000, 0.3));
  scene.addBody(new RigidBody(0, new Vector2(300, 500), new Box(20, 100), new Vector2(0, 0), 0, 1000, 0.3));
  
  // scene.addBody(new RigidBody(0, new Vector2(800, 400), new Box(1400, 20), new Vector2(0, 0), 0, 1000));
  // scene.addBody(new RigidBody(0, new Vector2(800, 600), new Box(1400, 20), new Vector2(0, 0), 0, 1000));
  // scene.addBody(new RigidBody(0, new Vector2(800, 700), new Box(1400, 20), new Vector2(0, 0), 0, 1000));
  // scene.addBody(new RigidBody(0, new Vector2(800, 800), new Box(1400, 20), new Vector2(0, 0), 0, 1000));
  // scene.addBody(new RigidBody(0, new Vector2(800, 850), new Box(1400, 20), new Vector2(0, 0), 0, 1000));

  return scene;
}
