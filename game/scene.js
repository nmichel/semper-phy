import { Scene as PhysicScene } from '../physic/scene.js';
import { Render as RenderProtocol } from '../physic/protocols/render.js';

import { Scene as RenderScene } from '../render/scene.js';

class Scene {
  constructor(context) {
    this.context = context;
    this.physicScene = new PhysicScene();
    this.renderScene = new RenderScene(context);
  }

  // registerObject(GameObject)
  registerObject(object) {
    const rigidBodies = object.getRigidbodies();
    rigidBodies && rigidBodies.forEach(rb => this.physicScene.addBody(rb));

    const rendering = object.getRenderObject();
    rendering && this.renderScene.addObject(rendering);
  }

  update(dt) {
    this.physicScene.step(dt);
  }

  render(dt) {
    this.renderScene.render(dt);
    RenderProtocol.render(this.physicScene, this.context);
  }
}

export { Scene };
