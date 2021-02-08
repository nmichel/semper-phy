import { AABB } from './aabb.js';
import { Circle } from './circle.js';
import { Ray } from './ray.js';
import { Render } from './protocols.js';
import { RigidBody } from './rigidbody.js';
import { Vector2 } from './math.js';

import * as GfxTools from './gfx.js';

import './aabb_protocols.js';
import './circle_protocols.js';
import './geom_protocols.js';
import './frame_protocols.js';
import './ray_protocols.js';
import './rigidbody_protocols.js';

const canvas = document.getElementById('game');
const canvasParent = canvas.parentElement;
canvas.width = canvasParent.offsetWidth;
canvas.height = canvasParent.offsetHeight;

const context = canvas.getContext('2d');

const bodies = [];
for (let i  = 0; i < 30; ++i) {
  const pos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
  const width = 10.0 + Math.random() * 100;
  const height = 10.0 + Math.random() * 100;
  const angle = Math.random() * 90;
  bodies.push(new RigidBody(angle, pos, new AABB(width, height)));
}

for (let i  = 0; i < 30; ++i) {
  const pos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
  const radius = 10.0 + Math.random() * 50;
  const angle = Math.random() * 90;
  bodies.push(new RigidBody(angle, pos, new Circle(radius)));
}

// bodies.push(new RigidBody(95, new Vector2(800, 300), new AABB(100, 60)));

let prevTs = performance.now();
let a = new Vector2(400, 600);
let b = new Vector2(1000, 200);

function loop(ts) {
  const deltaMs = ts - prevTs;
  prevTs = ts;

  context.clearRect(0, 0, canvas.width, canvas.height);
  bodies.forEach(body => Render.render(body, context, {debug: true}));

  const ray = Ray.buildRayFromPoints(a, b);
  const collisions = bodies.reduce((collisions, body) => [...collisions, ...ray.cast(body)], []);
  collisions.forEach(c => {
    Render.render(c, context);
  });

  Render.render(ray, context);

//  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// canvas.addEventListener("mousedown", mouseDownHandler, false);
// canvas.addEventListener("mouseup", mouseUpHandler, false);
// canvas.addEventListener("mousemove", mouseMoveHandler, false);
