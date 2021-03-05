import { AABB } from './aabb.js';
import { Circle } from './circle.js';
import { buildCircleContainedPolygon, Polygon } from './geom.js';
import { Ray } from './ray.js';
import { CollisionInfo, Collider, PointCaster, Render, Transformer } from './protocols.js';
import { RigidBody } from './rigidbody.js';
import { toDegres, Vector2, crossRotation, toRadians } from './math.js';

import './aabb_protocols.js';
import './circle_protocols.js';
import './geom_protocols.js';
import './frame_protocols.js';
import './ray_protocols.js';
import './rigidbody_protocols.js';

const momentOfIntertiaDisk = (mass, radius) => 1/2 * mass * radius * radius;
const momentOfIntertiaRectangle = (mass, height, width) => 1/12 * mass * (height * height + width * width);
const momentOfIntertiaRegularPolygon = (mass, radius, sides) => 1/6 * mass * radius * radius * (2 + Math.cos(2* Math.PI / sides));

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

// for (let i  = 0; i < 10; ++i) {
//   const pos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
//   const angle = Math.random() * 90;
//   const radius = 50.0 + Math.random() * 100;
//   const verts = Math.round(3 + Math.random() * 5);
//   const linearSpeed = new Vector2(Math.random() * 30 - 15, Math.random() * 30 - 15);
//   const angularSpeed = Math.random() * 36;
//   bodies.push(new RigidBody(angle, pos, buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), linearSpeed, angularSpeed, radius*radius));
// }

// bodies.push(new RigidBody(95, new Vector2(800, 300), new AABB(100, 60)));

// bodies.push(new RigidBody(50, new Vector2(800, 200), buildCircleContainedPolygon(new Vector2(0, 0), 100, 5), new Vector2(0, 10), -30, 1));
// bodies.push(new RigidBody(20, new Vector2(800, 500), buildCircleContainedPolygon(new Vector2(0, 0), 100, 5), new Vector2(0, -10), 20, 1));

bodies.push(new RigidBody(0, new Vector2(800, 20), new Polygon([new Vector2(700, 10), new Vector2(-700, 10), new Vector2(-700, -10), new Vector2(700, -10)]), new Vector2(0, 0), 0, 100000, momentOfIntertiaRectangle(100000, 1400, 20)));
bodies.push(new RigidBody(0, new Vector2(800, 900), new Polygon([new Vector2(700, 10), new Vector2(-700, 10), new Vector2(-700, -10), new Vector2(700, -10)]), new Vector2(0, 0), 0, 100000, momentOfIntertiaRectangle(100000, 1400, 20)));
bodies.push(new RigidBody(0, new Vector2(75, 460), new Polygon([new Vector2(10, 450), new Vector2(-10, 450), new Vector2(-10, -450), new Vector2(10, -450)]), new Vector2(0, 0), 0, 100000, momentOfIntertiaRectangle(100000, 20, 900)));
bodies.push(new RigidBody(0, new Vector2(1530, 460), new Polygon([new Vector2(10, 450), new Vector2(-10, 450), new Vector2(-10, -450), new Vector2(10, -450)]), new Vector2(0, 0), 0, 100000, momentOfIntertiaRectangle(100000, 20, 900)));

/*
for (let j  = 0; j < 5; ++j) {
  for (let i  = 0; i < 5; ++i) {
    const angle = Math.random() * 90;
    const radius = 30.0 + Math.random() * 40;
    const verts = Math.round(3 + Math.random() * 5);
    const linearSpeed = new Vector2(Math.random() * 70 - 35, Math.random() * 70 - 35);
    const angularSpeed = Math.random() * 36;
    bodies.push(new RigidBody(angle, new Vector2(800 + (j - 2) * 200, 200 + i * 150), buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), new Vector2(0, - Math.sign(i - 2) * 50), angularSpeed, 1));
    // bodies.push(new RigidBody(angle, new Vector2(800 + (j - 2) * 200, 200 + i * 150), buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), linearSpeed, angularSpeed, 1));
  }
}
*/

// bodies.push(new RigidBody(50, new Vector2(800, 200), new Circle(50), new Vector2(10, 10), -30, 1));
// bodies.push(new RigidBody(20, new Vector2(800, 500), new Circle(30), new Vector2(10, -10), 20, 1));

/*
for (let j  = 0; j < 5; ++j) {
  for (let i  = 0; i < 5; ++i) {
    const angle = Math.random() * 90;
    const radius = 30.0 + Math.random() * 40;
    const scalarVelocity = 140;
    const linearSpeed = new Vector2(Math.random() * scalarVelocity - scalarVelocity/2, Math.random() * scalarVelocity - scalarVelocity/2);
    const angularSpeed = Math.random() * 36;
    bodies.push(new RigidBody(angle, new Vector2(800 + (j - 2) * 200, 200 + i * 150), new Circle(radius), linearSpeed, angularSpeed, 1));
//    bodies.push(new RigidBody(angle, new Vector2(800 + (j - 2) * 200, 200 + i * 150), new Circle(radius), new Vector2(0, - Math.sign(i - 2) * 50), angularSpeed, 1));
  }
}
*/

// bodies.push(new RigidBody(20, new Vector2(800, 200), new Circle(30), new Vector2(5, 10), 20, 1));
// bodies.push(new RigidBody(50, new Vector2(800, 500), buildCircleContainedPolygon(new Vector2(0, 0), 100, 5), new Vector2(0, -10), -30, 1));

for (let j  = 0; j < 5; ++j) {
  for (let i  = 0; i < 5; ++i) {
    const angle = Math.random() * 90;
    const radius = 30.0 + Math.random() * 40;
    const scalarVelocity = 140;
    const linearSpeed = new Vector2(Math.random() * scalarVelocity - scalarVelocity/2, Math.random() * scalarVelocity - scalarVelocity/2);
    const angularSpeed = Math.random() * 36;
    if (Math.random() > 0.5) {
      bodies.push(new RigidBody(angle, new Vector2(800 + (j - 2) * 200, 200 + i * 150), new Circle(radius), linearSpeed, angularSpeed, radius*radius, momentOfIntertiaDisk(10, radius*radius)));
    }
    else {
      const verts = Math.round(3 + Math.random() * 5);
      bodies.push(new RigidBody(angle, new Vector2(800 + (j - 2) * 200, 200 + i * 150), buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), new Vector2(0, - Math.sign(i - 2) * 50), angularSpeed, radius*radius, momentOfIntertiaRegularPolygon(10, radius*radius, verts)));
    }
  }
}

let prevTs = performance.now();
let a = new Vector2(400, 600);
let b = new Vector2(1000, 200);

let movingBody = null;

function loop(ts) {
  const deltaMs = ts - prevTs;
  prevTs = ts;

  context.clearRect(0, 0, canvas.width, canvas.height);
  bodies.forEach(body => body.updateFrame(deltaMs/1000));
  bodies.forEach(body => Render.render(body, context, {debug: false}));

  const ray = Ray.buildRayFromPoints(a, b);
  bodies
  .reduce((collisions, body) => [...collisions, ...ray.cast(body)], [])
  .forEach(c => Render.render(c, context));

  let collisions = [];

  for (let i = 0; i < bodies.length; ++i) {
    const a = bodies[i];
    for (let j = i+1; j < bodies.length; ++j) {
      if (i === j) {
        continue;
      }

      const b = bodies[j];
      const worldShapeA = Transformer.toWorld(a.shape, a.frame);
      const worldShapeB = Transformer.toWorld(b.shape, b.frame);
      
      Collider.collide(worldShapeA, worldShapeB)
      .forEach(collision => collisions.push({ collision, a, b }));
    }
  }

  collisions.forEach(p => Render.render(p.collision, context));

  collisions.forEach(({ a, b, collision }) => applyImpulse(a, b, collision));

  Render.render(ray, context);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function applyImpulse(a, b, collision) {
  const { point, normal, magnitude } = collision;
  const invMassA = a.mass > 0 ? 1.0 / a.mass : 0;
  const invMassB = b.mass > 0 ? 1.0 / b.mass : 0;
  const invMassSum = invMassA + invMassB;
  if (invMassSum == 0.0) {
    return;
  }
  const relativeNormal = normal.clone();
  if (b.frame.position.sub(a.frame.position).dot(relativeNormal) < 0) {
    relativeNormal.scaleSelf(-1)
  }

  const rap = point.sub(a.frame.position);
  const rbp = point.sub(b.frame.position);
  const relativeVelocity = b.linearVelocity.add(crossRotation(toRadians(b.angularVelocity), rbp)).sub(a.linearVelocity.add(crossRotation(toRadians(a.angularVelocity), rap)));

  const relativeVelocityOnNormal = relativeVelocity.dot(relativeNormal);
  if (relativeVelocityOnNormal > 0) {
    return;
  }  

  const CoefApCrossN = rap.crossCoef(relativeNormal);
  const CoefBpCrossN = rbp.crossCoef(relativeNormal);
  const Ia = a.inertia;
  const Ib = b.inertia;
  const e = Math.min(a.restitution, b.restitution);
  const numerator = -(1 + e) * relativeVelocityOnNormal;
  const denominator = invMassSum + (CoefApCrossN * CoefApCrossN / Ia) + (CoefBpCrossN * CoefBpCrossN / Ib);
  const j = numerator / denominator;
  const impulse = relativeNormal.scale(j);

  a.linearVelocity.addToSelf(impulse.scale(-invMassA));
  b.linearVelocity.addToSelf(impulse.scale(invMassB));

  a.angularVelocity -= toDegres(rap.crossCoef(relativeNormal.scale(j)) / Ia);
  b.angularVelocity += toDegres(rbp.crossCoef(relativeNormal.scale(j)) / Ib);

  // Positionnal correction
  // 
  const percent = 0.2 // usually 20% to 80%
  const slop = 0.01 // usually 0.01 to 0.1
  const correction = normal.scale(Math.max(magnitude - slop, 0.0) / invMassSum * percent);
  a.frame.position.subToSelf(correction.scale(invMassA));
  b.frame.position.addToSelf(correction.scale(invMassB));
}

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
