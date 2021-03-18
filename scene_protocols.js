import { defimpl } from './functional.js';
import { Render } from './protocols/protocols.js';
import { Scene } from './scene.js';

defimpl(Render, Scene, 'render', (scene, ctxt) => {
  scene.collisions.forEach(p => Render.render(p.collision, ctxt));
  scene.bodies.forEach(body => Render.render(body, ctxt, {debug: false}));
});
