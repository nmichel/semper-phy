import '../../../physic/engine.js';
import { AABB } from '../../../physic/aabb.js'
import { Ray } from '../../../physic/ray.js'
import { Render as RenderProtocol } from '../../../physic/protocols/render.js';
import { Scene as PhysicScene } from '../../../physic/scene.js';
import { Circle } from '../../../physic/circle.js';
import { RigidBody } from '../../../physic/rigidbody.js';
import * as GfxTools from '../../../physic/gfx.js';

import { Scene as RenderScene } from '../../../render/scene.js';
import { Object as SceneObject } from '../../../render/object.js';

import { toRadians, toDegres } from '../../../physic/math.js';
import { Vector2 } from '../../../physic/math.js';

let ray = null;
let aiming = false;
let shoot = false;

class GameScene {
  constructor(context) {
    this.context = context;
    this.physicScene = new PhysicScene();
    this.renderScene = new RenderScene(context);
  }

  // registerObject(GameObject)
  registerObject(object) {
    const rigidBody = object.getRigidbody();
    rigidBody && this.physicScene.addBody(rigidBody);

    const rendering = object.getRenderObject();
    rendering && this.renderScene.addObject(rendering);
  }

  update(dt) {
    this.physicScene.step(dt);
  }

  render(dt) {
    this.renderScene.render(dt);
    // RenderProtocol.render(this.physicScene, this.context);
  }
}

class GameObject {
  // constructor(RigidBody, SceneObject)
  constructor(rigidBody, renderObject) {
    this.rigidBody = rigidBody;
    this.renderObject = renderObject;

    rigidBody.addListener(this.physicUpdate.bind(this));
  }

  getRigidbody() {
    return this.rigidBody;
  }

  getRenderObject() {
    return this.renderObject;
  }

  physicUpdate() {
    throw new Error("not implemented");
  }
}

class ImageManager {
  constructor() {
    this.images = {};
  }

  addResource(name) {
    const img = new Image();
    img.src = name;
    img.onload = (_event) => {
      this.images[name] = img;
    }
  }

  getImage(name) {
    return this.images[name];
  }
};


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

class BallRenderObject extends SceneObject {
  constructor(imageName, x, y) {
    super(x, y);
    this.imageName = imageName;
  }

  render(ctxt, dt) {
    const alpha = toRadians(this.alpha);
    const radius = 40;

    ctxt.save();
      ctxt.strokeStyle = 'white';
      ctxt.fillStyle = '#444';
      ctxt.lineWidth = 2;
      ctxt.translate(this.x, this.y);
      ctxt.beginPath();
      ctxt.rotate(alpha);
      ctxt.arc(0, 0, radius, 0, 2 * Math.PI, true);
      ctxt.fill();

      const img = imageManager.getImage(this.imageName);
      if (img) {
        const hw = radius * Math.sin(toRadians(45));
        const scaleFactor = hw * 2 / img.width;
          ctxt.save();
          ctxt.clip();
          ctxt.scale(scaleFactor, scaleFactor);
          ctxt.translate(-img.width/2, -img.width/2);
          ctxt.drawImage(img, 0, 0);
        ctxt.restore();
      }

      ctxt.stroke();
    ctxt.restore();
  }
}

const radius = 40;
const mass = radius * radius * Math.PI * 0.01;

class BallGameObject extends GameObject {
  constructor(imageName, x, y, alpha) {
    super(
      new RigidBody(alpha, new Vector2(x, y), new Circle(radius), new Vector2(), 0, mass),
      new BallRenderObject(imageName, x, y));
  }

  physicUpdate() {
    this.renderObject.x = this.rigidBody.frame.position.x;
    this.renderObject.y = this.rigidBody.frame.position.y;
    this.renderObject.alpha = this.rigidBody.frame.rotation;
  }
};

const scene = new GameScene(context);

const yPos = 450;

const triangleHeight = 5;
const angle = toRadians(30);
const c = Math.cos(angle) * radius * 2;
const s = Math.sin(angle) * radius * 2;
const iStep = new Vector2(c, -s);
const jStep = new Vector2(c, s);
const origin = new Vector2(800, yPos);
for (let i = 0, idx = 0; i < triangleHeight; ++i) {
  const base = iStep.scale(i).add(origin);
  for (let j = 0; j < triangleHeight - i; ++j, ++idx) {
    const pos = base.add(jStep.scale(j));
    scene.registerObject(new BallGameObject(images[idx % images.length], pos.x, pos.y));
  }
}

scene.physicScene.addBody(new RigidBody(0, new Vector2(800, 20), new AABB(1400, 20), new Vector2(0, 0), 0, 0));
scene.physicScene.addBody(new RigidBody(0, new Vector2(800, 900), new AABB(1400, 20), new Vector2(0, 0), 0, 0));
scene.physicScene.addBody(new RigidBody(0, new Vector2(75, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));
scene.physicScene.addBody(new RigidBody(0, new Vector2(1530, 460), new AABB(20, 900), new Vector2(0, 0), 0, 0));

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  let impulseInfo = null;

  if (ray) {
    const collisions = scene.physicScene.bodies.reduce((collisions, body) => [...collisions, ...(ray.cast(body).map(c => {return { collision: c, body }}))], [])
    if (collisions.length > 0) {
      const closest = collisions.reduce((current, item) => item.collision.t < current.collision.t ? item : current);
      impulseInfo = closest;

      if (shoot) {
        const { collision, body } = impulseInfo;
        const { position } = body.frame;
        const r = collision.point.sub(position);
        const magnitudeVector = endPoint.sub(startPoint);
        const scaleFactor = 30;
        const magnitude = magnitudeVector.length();
        const impulse = ray.direction.scale(magnitude * scaleFactor);
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
    const { point } = collision;
    const r = point.sub(position);
    const magnitudeVector = endPoint.sub(startPoint);
    RenderProtocol.render(collision, context);
    GfxTools.drawVector(context, position, position.add(r), { strokeStyle: 'orange', lineDash: [5, 5] });
    GfxTools.drawVector(context, point.sub(magnitudeVector), point, { strokeStyle: 'white', lineWidth: 5 });
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
