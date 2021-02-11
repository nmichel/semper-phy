import { AABB } from './aabb.js';
import { Circle } from './circle.js';
import { CollisionInfo, buildCircleContainedPolygon, sat } from './geom.js';
import { Ray } from './ray.js';
import * as protocols from './protocols.js';
import { RigidBody } from './rigidbody.js';
import { Vector2 } from './math.js';

const { PointCaster, Render, Transformer } = protocols;

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
// for (let i  = 0; i < 10; ++i) {
//   const pos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
//   const width = 10.0 + Math.random() * 100;
//   const height = 10.0 + Math.random() * 100;
//   const angle = Math.random() * 90;
//   bodies.push(new RigidBody(angle, pos, new AABB(width, height)));
// }

// for (let i  = 0; i < 10; ++i) {
//   const pos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
//   const radius = 10.0 + Math.random() * 50;
//   const angle = Math.random() * 90;
//   bodies.push(new RigidBody(angle, pos, new Circle(radius)));
// }

for (let i  = 0; i < 10; ++i) {
  const pos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
  const angle = Math.random() * 90;
  const radius = 50.0 + Math.random() * 100;
  const verts = Math.round(3 + Math.random() * 5);
  bodies.push(new RigidBody(angle, pos, buildCircleContainedPolygon(new Vector2(0, 0), radius, verts)));
}

// bodies.push(new RigidBody(95, new Vector2(800, 300), new AABB(100, 60)));
// bodies.push(new RigidBody(95, new Vector2(800, 300), buildCircleContainedPolygon(new Vector2(0, 0), 100, 5)));

let prevTs = performance.now();
let a = new Vector2(400, 600);
let b = new Vector2(1000, 200);

let movingBody = null;

function loop(ts) {
  const deltaMs = ts - prevTs;
  prevTs = ts;

  context.clearRect(0, 0, canvas.width, canvas.height);
  bodies.forEach(body => Render.render(body, context, {debug: body == movingBody}));

  const ray = Ray.buildRayFromPoints(a, b);
  const collisions = bodies.reduce((collisions, body) => [...collisions, ...ray.cast(body)], []);
  collisions.forEach(c => {
    Render.render(c, context);
  });

  let satCollisions = [];

  if (movingBody) {
    const movingBodyShapeInWorld = Transformer.toWorld(movingBody.shape, movingBody.frame);
      bodies.forEach(body => {
        if (movingBody == body) {
          return;
        }
        const worldShape = Transformer.toWorld(body.shape, body.frame);
        const {found, separatingEdge, magnitude} = sat(movingBodyShapeInWorld, worldShape);
        if (! found) {
          satCollisions.push(new CollisionInfo(separatingEdge, magnitude));

          const c = separatingEdge.normal;
          const movingToOther = body.frame.position.sub(movingBody.frame.position);
          let correctFactor =  Math.sign(movingToOther.dot(c));
          const pushVector = c.scale(correctFactor).scale(magnitude);
          body.frame.setPosition(body.frame.position.add(pushVector));
        }
      })
    }

  // const instances = bodies.map(body => Transformer.toWorld(body.shape, body.frame));
  // let satCollisions = [];
  // for (let i = 0; i < instances.length; ++i) {
  //   const p1 = instances[i];
  //   for (let j = i+1; j < instances.length; ++j) {
  //     const p2 = instances[j];

  //     const {found, separatingEdge, magnitude} = sat(p1, p2);
  //     if (! found) {
  //       satCollisions.push(new CollisionInfo(separatingEdge, magnitude));
  //     }
  //   }
  // }

  satCollisions.forEach(p => Render.render(p, context));

  Render.render(ray, context);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function mouseDownHandler(e) {
  const rect = canvas.getBoundingClientRect();
  const position = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
  movingBody = bodies.find(b => PointCaster.contains(b, position));
}

function mouseUpHandler(e) {
  movingBody = null;
}

function mouseMoveHandler(e) {
  if (movingBody) {
    const mouseMovementX = e.movementX;
    const mouseMovementY = e.movementY;
    const direction = new Vector2(mouseMovementX, mouseMovementY);
    movingBody.frame.setPosition(movingBody.frame.position.add(direction));
  }
}

canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);

window.protocols = protocols;