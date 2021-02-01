import { Vector2 } from './math.js';
import { CollisionInfo, buildCircleContainedPolygon, sat } from './geom.js';
import { DebugPolygon } from './geom_debug.js';
import { Render } from './protocols.js';

import './geom_protocols.js';
import './geom_debug_protocols.js';

class Collider {
  // constructor(Polygon, Vector2) -> Collider
  constructor(polygon, speed) {
    this.polygon = polygon;
    this.speed = speed;
  }
}

const canvas = document.getElementById('game');
const canvasParent = canvas.parentElement;
canvas.width = canvasParent.offsetWidth;
canvas.height = canvasParent.offsetHeight;

const context = canvas.getContext('2d');

const colliders = [];
for (let i  = 0; i < 10; ++i) {
  const pos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
  const radius = 50.0 + Math.random() * 100;
  const verts = Math.round(3 + Math.random() * 5);
  const speed = new Vector2(Math.random() * 40 - 20, Math.random() * 40 - 20);
  colliders.push(new Collider(buildCircleContainedPolygon(pos, radius, verts), speed))
}

const findCollider = (position) => colliders.find(c => c.polygon.vertices.find(v => Math.abs(position.sub(v).length()) < 5)); // MOOOAHAAHHAHHA
const moveCollider = (collider, delta) => collider.polygon.vertices.forEach(v => v.addToSelf(delta));

let moving = false;
let activeCollider = null;

function mouseDownHandler(e) {
  const rect = canvas.getBoundingClientRect();
  const position = new Vector2(e.clientX - rect.left, e.clientY - rect.top);

  if (activeCollider = findCollider(position)) {
    moving = true;
  }
}

function mouseUpHandler(e) {
  moving = false;
}

function mouseMoveHandler(e) {
  const mouseMovementX = e.movementX;
  const mouseMovementY = e.movementY;
  const direction = new Vector2(mouseMovementX, mouseMovementY);
  
  if (moving && activeCollider) {
    moveCollider(activeCollider, direction);
  }
}

const animateCollider = (collider, deltaMs) => {
  const posUpdate = collider.speed.scale(deltaMs / 1000);
  collider.polygon.vertices.forEach(v => v.addToSelf(posUpdate))
};

let prevTs = performance.now();

function loop(ts) {
  const deltaMs = ts - prevTs;
  prevTs = ts;
  let collisions = [];

  colliders.forEach(c => {
    animateCollider(c, deltaMs);
  });

  for (let i = 0; i < colliders.length; ++i) {
    const p1 = colliders[i].polygon;
    for (let j = i+1; j < colliders.length; ++j) {
      const p2 = colliders[j].polygon;

      const {found, separatingEdge, magnitude} = sat(p1, p2);
      if (! found) {
        p1.collide = true;
        p2.collide = true;
        collisions.push(new CollisionInfo(separatingEdge, magnitude));
      }
    }
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  colliders.forEach(collider => Render.render(collider.polygon, context, {debug: true}));
  collisions.forEach(p => Render.render(p, context));

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);
