import { defimpl } from './Protocol';
import { Render, Transformer } from './protocols/protocols';
import { Scene } from './scene.js';

class CollisionTrail {
  collisions: { collision: any; ttl: number }[] = [];

  add(collision) {
    this.collisions.push({ collision, ttl: 50 });
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

defimpl(Render, CollisionTrail, {
  render: (collisionTrail, ctxt, opts): undefined => {
    collisionTrail.collisions.forEach(p => Render.render(p.collision, ctxt, opts));
  },
});

defimpl(Render, Scene, {
  render: (scene: Scene, ctxt, opts): undefined => {
    scene.bodies.forEach(body => Render.render(body, ctxt, opts));

    scene.anchors.forEach(anchor => {
      const transformedAnchor = Transformer.toWorld(anchor, anchor.rigidbody.frame);
      Render.render(transformedAnchor, ctxt, opts);
    });

    if (opts?.debug?.enabled === true && opts?.debug?.showTrail === true) {
      scene.collisions.forEach(p => trail.add(p.collision));
      Render.render(trail, ctxt, opts);
    }
    trail.update();
  },
});
