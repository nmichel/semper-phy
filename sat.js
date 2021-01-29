import { Vector2 } from './math.js';
import { CollisionInfo, buildCircleContainedPolygon, sat } from './geom.js';
import { DebugPolygon } from './geom_debug.js';
import { Render } from './protocols.js';

import './geom_protocols.js';
import './geom_debug_protocols.js';

const canvas = document.getElementById('game');
const canvasParent = canvas.parentElement;
canvas.width = canvasParent.offsetWidth;
canvas.height = canvasParent.offsetHeight;

const context = canvas.getContext('2d');

const polygons = [];
for (let i  = 0; i < 2; ++i) {
  const pos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
  const radius = 50.0 + Math.random() * 100;
  const verts = Math.round(3 + Math.random() * 5);
  polygons.push(buildCircleContainedPolygon(pos, radius, verts));
}
const decoratedPolygons = polygons.map((p, idx) => new DebugPolygon(p, idx));

const findPolygon = (position) => polygons.find(p => p.vertices.find(v => Math.abs(position.sub(v).length()) < 5)); // MOOOAHAAHHAHHA

const movePolygon = (p, delta) => p.vertices.forEach(v => v.addToSelf(delta));

let moving = false;
let activePolygon = null;

function mouseDownHandler(e) {
  const rect = canvas.getBoundingClientRect();
  const position = new Vector2(e.clientX - rect.left, e.clientY - rect.top);

  if (activePolygon = findPolygon(position)) {
    moving = true;
  }
}

function mouseUpHandler(e) {
  moving = false;
}

let collisions = [];

function mouseMoveHandler(e) {
  const mouseMovementX = e.movementX;
  const mouseMovementY = e.movementY;
  const direction = new Vector2(mouseMovementX, mouseMovementY);
  
  if (moving && activePolygon) {
    collisions = [];
    decoratedPolygons.forEach( p => p.collide = false);
  
    movePolygon(activePolygon, direction);

    for (let i = 0; i < decoratedPolygons.length; ++i) {
      const p1 = decoratedPolygons[i];
      for (let j = i+1; j < decoratedPolygons.length; ++j) {
        const p2 = decoratedPolygons[j];

        const {found, separatingEdge, magnitude} = sat(p1.p, p2.p);
        if (! found) {
          p1.collide = true;
          p2.collide = true;
          collisions.push(new CollisionInfo(separatingEdge, magnitude));
        }
      }
    }

    requestAnimationFrame(loop);
  }
}

let redraw = false;
let prevTs = performance.now();

function loop(ts) {
  const deltaMs = ts - prevTs;
  prevTs = ts;

  context.clearRect(0, 0, canvas.width, canvas.height);
  decoratedPolygons.forEach(p => Render.render(p, context, {debug: true}));
  collisions.forEach(p => Render.render(p, context));

  redraw && requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);
