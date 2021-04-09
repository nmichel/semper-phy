import '../../../physic/engine.js';
import { Cloner } from '../../../physic/protocols/protocols.js'
import { Ray } from '../../../physic/ray.js'
import { Render as RenderProtocol } from '../../../physic/protocols/render.js';
import * as GfxTools from '../../../physic/gfx.js';

import { ImageManager } from '../../../render/image_manager.js';

import { Scene as GameScene } from '../../../game/scene.js';

import { toRadians } from '../../../physic/math.js';
import { Vector2 } from '../../../physic/math.js';

import { Ball as BallGameObject } from './ball.js';
import { Table as TableGameObject } from './table.js';

let ray = null;
let aiming = false;
let shoot = false;

const renderScale = 5;

const images = [
  './img/chat.png',
  './img/chien.png',
  './img/cochon.png',
  './img/sanglier.png',
  './img/poussin.png',
  './img/renard.png',
  './img/singe.png',
  './img/souris.png',
  './img/lapin.png',
  './img/ours.png',
  './img/panda.png',
  './img/tigre.png',
  './img/lion.png'
];

const imageManager = new ImageManager();
images.forEach(name => imageManager.addResource(name));

const canvas = document.getElementById('game');
const canvasParent = canvas.parentElement;
canvas.width = canvasParent.offsetWidth;
canvas.height = canvasParent.offsetHeight;

const context = canvas.getContext('2d');

const ball_radius = 0.057;

const h = 1.37;
const w = 2.36;
const hh = h/2;
const thick = 0.127;

const scene = new GameScene(context);
scene.registerObject(new TableGameObject(w, h, thick));

const yPos = hh;

const triangleHeight = 5;
const angle = toRadians(30);
const c = Math.cos(angle) * ball_radius * 2;
const s = Math.sin(angle) * ball_radius * 2;
const iStep = new Vector2(c, -s);
const jStep = new Vector2(c, s);
const origin = new Vector2(1.00, yPos);
for (let i = 0, idx = 0; i < triangleHeight; ++i) {
  const base = iStep.scale(i).add(origin);
  for (let j = 0; j < triangleHeight - i; ++j, ++idx) {
    const pos = base.add(jStep.scale(j));
    scene.registerObject(new BallGameObject(ball_radius, imageManager.getImage(images[idx % images.length]), pos.x, pos.y));
  }
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  let impulseInfo = null;

  if (ray) {
    const realSizeRay = Cloner.clone(ray);
    realSizeRay.origin.scaleSelf(1.0/renderScale * 0.01);

    const collisions = scene.physicScene.bodies.reduce((collisions, body) => [...collisions, ...(realSizeRay.cast(body).map(c => {return { collision: c, body }}))], [])
    if (collisions.length > 0) {
      const closest = collisions.reduce((current, item) => item.collision.t < current.collision.t ? item : current);
      impulseInfo = closest;

      if (shoot) {
        const { collision, body } = impulseInfo;
        const { position } = body.frame;
        const r = collision.point.sub(position);
        const magnitudeVector = endPoint.sub(startPoint);
        const scaleFactor = (1.0 / renderScale) * 0.002;
        const magnitude = magnitudeVector.length();
        const impulse = realSizeRay.direction.scale(magnitude * scaleFactor);
        console.log("||impulse||", impulse.length());
        body.applyImpulse(impulse, r);

        ray = null;
        shoot = false;
      }
    }
  }

  const dt = 60;
  scene.update(dt);
  scene.render(dt);

  if (impulseInfo) {
    const { collision, body } = impulseInfo;
    const { position } = body.frame;
    const rescaledPosition = position.scale(renderScale * 100);
    const rescaledCollision = Cloner.clone(collision);
    rescaledCollision.point.scaleSelf(renderScale * 100);
    const { point: rescaledPoint } = rescaledCollision;
    const r = rescaledPoint.sub(rescaledPosition);
    const magnitudeVector = endPoint.sub(startPoint);
    // const scaleFactor = (1.0 / renderScale) * 0.002;
    // console.log("||impulse||", magnitudeVector.length() * scaleFactor);
    RenderProtocol.render(rescaledCollision, context);
    GfxTools.drawVector(context, rescaledPosition, rescaledPosition.add(r), { strokeStyle: 'orange', lineDash: [5, 5] });
    GfxTools.drawVector(context, rescaledPoint.sub(magnitudeVector), rescaledPoint, { strokeStyle: 'white', lineWidth: 5 });
  }

  ray && RenderProtocol.render(ray, context);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

let startPoint = null;
let endPoint = null;

function mouseDownHandler(e) {
  const rect = canvas.getBoundingClientRect();
  startPoint = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
  endPoint = null;
  ray = null;
  aiming = true;
}

function mouseUpHandler(e) {
  aiming = false;
  shoot = true;
}

function mouseMoveHandler(e) {
  if (aiming) {
    const rect = canvas.getBoundingClientRect();
    endPoint = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
    ray = Ray.buildRayFromPoints(startPoint, endPoint);
  
    // const mouseMovementX = e.movementX;
    // const mouseMovementY = e.movementY;
    // const direction = new Vector2(mouseMovementX, mouseMovementY);
  }
}

canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);
