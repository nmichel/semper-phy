import './physic/engine.js';
import { buildCircleContainedPolygon } from './physic/geom';

import { App } from './app.js'
import { Render } from './physic/protocols/protocols.js';
import { Circle } from './physic/circle';
import { Box } from './physic/box';
import { RigidBody } from './physic/rigidbody.js';
import { Scene } from './physic/scene.js';
import { Vector2 } from './physic/math.js';


class MyApp extends App {
  constructor(divElement) {
    super(divElement);

    this.#mousePos = new Vector2(0, 0);
    this.#buildScene();
  }

  onClick(e) {
    if (this.isRunning) {
      this.#addBody();
    }
  }

  onDblclick(_e) {
    this.isRunning = !this.isRunning;
  }

  onMousemove(e) {
    this.#mousePos = new Vector2(e.offsetX, e.offsetY);
  }

  onKeydown(e) {
    if (this.isRunning) {
      e.preventDefault();
      this.#addBody();
    }
  }

  render(dt) {
    this.#scene.step(dt);  
    Render.render(this.#scene, this.context);
  }

  #addBody() {
    const radius = 10.0 + Math.random() * 20;
    const linearSpeed = new Vector2(0, 0);
    const angularSpeed = 0;
    if (Math.random() > 0.6) {
      this.#scene.addBody(new RigidBody(0, this.#mousePos.clone(), new Circle(radius), linearSpeed, angularSpeed, radius*radius));
    }
    else {
      const verts = Math.round(3 + Math.random() * 5);
      this.#scene.addBody(new RigidBody(0, this.#mousePos.clone(), buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), linearSpeed, angularSpeed, radius*radius));
    }
  }

  #buildScene() {
    const scene = new Scene();
    scene.addBody(new RigidBody(0, new Vector2(250, 450), new Box(400, 20), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(20, 250), new Box(20, 300), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(480, 250), new Box(20, 300), new Vector2(0, 0), 0, 0));
  
    const radius = 30.0;
    scene.addBody(new RigidBody(0, new Vector2(250, 50), new Circle(radius), new Vector2(0, 0), 0, radius*radius));

    this.#scene = scene
  }

  #scene;
  #mousePos;
}

const app = new MyApp(document.getElementById('app'));

//

class MyApp2 extends App {
  constructor(divElement) {
    super(divElement);

    this.#mousePos = new Vector2(0, 0);
    this.#buildScene();
  }

  onClick(e) {
    if (this.isRunning) {
      this.#addBody();
    }
  }

  onDblclick(_e) {
    this.isRunning = !this.isRunning;
  }

  onMousemove(e) {
    this.#mousePos = new Vector2(e.offsetX, e.offsetY);
  }

  onKeydown(e) {
    if (this.isRunning) {
      e.preventDefault();
      this.#addBody();
    }
  }

  render(dt) {
    this.#scene.step(dt);  
    Render.render(this.#scene, this.context);
  }

  #addBody() {
    const radius = 10.0 + Math.random() * 20;
    const linearSpeed = new Vector2(0, 0);
    const angularSpeed = 0;
    this.#scene.addBody(new RigidBody(0, this.#mousePos.clone(), new Box(3*radius, radius), linearSpeed, angularSpeed, radius*radius));
  }

  #buildScene() {
    const scene = new Scene();
    scene.addBody(new RigidBody(0, new Vector2(250, 450), new Box(400, 20), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(20, 250), new Box(20, 300), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(480, 250), new Box(20, 300), new Vector2(0, 0), 0, 0));
  
    const radius = 30.0;
    scene.addBody(new RigidBody(0, new Vector2(250, 50), new Circle(radius), new Vector2(0, 0), 0, radius*radius));

    this.#scene = scene
  }

  #scene;
  #mousePos;
}

const app2 = new MyApp2(document.getElementById('app2'));

