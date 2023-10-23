import { defimpl } from './functional.js';
import { Render } from './protocols/protocols.js';
import { Scene } from './scene.js';

class CollisionTrail {
  collisions = [];

  add(collision) {
    this.collisions.push({collision, ttl: 50});
  }

  update() {
    for (let i = 0; i < this.collisions.length; i++) {
      this.collisions[i].ttl--;
    }
    this.collisions.sort((a, b) => a.ttl - b.ttl);
    
    let i = 0;
    for (i = 0; i < this.collisions.length && this.collisions[i].ttl === 0; i++);

    this.collisions.splice(0, i);
  }
}

const trail = new CollisionTrail();

defimpl(Render, CollisionTrail, 'render', (collisionTrail, ctxt) => {
  collisionTrail.collisions.forEach(p => Render.render(p.collision, ctxt));
});

defimpl(Render, Scene, 'render', (scene, ctxt) => {
  scene.collisions.forEach(p => trail.add(p.collision));
  scene.bodies.forEach(body => Render.render(body, ctxt, {debug: false}));
  Render.render(trail, ctxt);
  trail.update();
});
