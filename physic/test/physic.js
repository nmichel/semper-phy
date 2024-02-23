import '../../../physic/engine.js';
import { Ray } from '../Ray';
import { Render } from '../protocols/protocols.js';
import { Vector2 } from '../Math';
import * as GfxTools from '../GfxUtils';
// import buildScene from './scenes/random_grid.js';
import buildScene from './scenes/spinning_squares.js';
// import buildScene from './scenes/just_a_bar.js';
// import buildScene from './scenes/pool.js';
// import buildScene from './scenes/squares_struggle.js';
// import buildScene from './scenes/simple.js';

const canvas = document.getElementById('game');
const canvasParent = canvas.parentElement;
canvas.width = canvasParent.offsetWidth;
canvas.height = canvasParent.offsetHeight;

const context = canvas.getContext('2d');

const scene = buildScene();

let prevTs = performance.now();

let ray = null;

function loop(ts) {
  const deltaMs = ts - prevTs;
  prevTs = ts;

  let impulseInfo = null;

  if (ray) {
    const collisions = scene.bodies.reduce(
      (collisions, body) => [
        ...collisions,
        ...ray.cast(body).map(c => {
          return { collision: c, body };
        }),
      ],
      []
    );
    if (collisions.length > 0) {
      const closest = collisions.reduce((current, item) => (item.collision.t < current.collision.t ? item : current));
      impulseInfo = closest;

      const { collision, body } = impulseInfo;
      const { position } = body.frame;
      const r = collision.point.sub(position);
      const magnitudeVector = endPoint.sub(startPoint);
      const scaleFactor = 10;
      const magnitude = magnitudeVector.length();
      const impulse = ray.direction.scale(magnitude * scaleFactor);
      body.applyImpulse(impulse, r);
    }
  }

  scene.step(deltaMs);

  context.clearRect(0, 0, canvas.width, canvas.height);

  Render.render(scene, context);

  if (impulseInfo) {
    const { collision, body } = impulseInfo;
    const { position } = body.frame;
    const { point } = collision;
    const r = point.sub(position);
    const magnitudeVector = endPoint.sub(startPoint);
    Render.render(collision, context);
    GfxTools.drawVector(context, position, position.add(r), { strokeStyle: 'orange', lineDash: [5, 5] });
    GfxTools.drawVector(context, point.sub(magnitudeVector), point, { strokeStyle: 'white', lineWidth: 5 });
  }

  ray && Render.render(ray, context);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

let startPoint = null;
let endPoint = null;

function mouseDownHandler(e) {
  const rect = canvas.getBoundingClientRect();
  startPoint = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
  endPoint = null;
  ray = null;
}

function mouseUpHandler(e) {
  startPoint = null;
  endPoint = null;
  ray = null;
}

function mouseMoveHandler(e) {
  if (startPoint) {
    const rect = canvas.getBoundingClientRect();
    endPoint = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
    ray = Ray.buildRayFromPoints(startPoint, endPoint);

    // const mouseMovementX = e.movementX;
    // const mouseMovementY = e.movementY;
    // const direction = new Vector2(mouseMovementX, mouseMovementY);
  }
}

canvas.addEventListener('mousedown', mouseDownHandler, false);
canvas.addEventListener('mouseup', mouseUpHandler, false);
canvas.addEventListener('mousemove', mouseMoveHandler, false);
