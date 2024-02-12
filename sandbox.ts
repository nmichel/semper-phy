import './physic/engine.js';
import { buildCircleContainedPolygon } from './physic/shapes/geom.js';

import { BrowserApp } from './browser_app.js';
import { Render } from './physic/protocols/protocols.js';
import { Circle } from './physic/shapes/Circle.js';
import { Box } from './physic/shapes/Box.js';
import { RigidBody } from './physic/Rigidbody.js';
import { Scene } from './physic/Scene.js';
import { Vector2 } from './physic/Math.js';

class MyApp extends BrowserApp {
  constructor(divElement) {
    super(divElement);

    this.#mousePos = new Vector2(0, 0);
    this.#buildScene();
  }

  override onClick(e): void {
    if (super.isRunning) {
      this.#addBody();
    }
  }

  override onDblclick(_e) {
    super.isRunning = !super.isRunning;
  }

  override onMousemove(e) {
    this.#mousePos = new Vector2(e.offsetX, e.offsetY);
  }

  override onKeydown(e) {
    if (super.isRunning) {
      e.preventDefault();
      this.#addBody();
    }
  }

  override render(dt) {
    this.#scene.step(dt);
    Render.render(this.#scene, super.context as CanvasRenderingContext2D);
  }

  #addBody() {
    const radius = 10.0 + Math.random() * 20;
    const linearSpeed = new Vector2(0, 0);
    const angularSpeed = 0;
    if (Math.random() > 0.6) {
      this.#scene.addBody(new RigidBody(0, this.#mousePos.clone(), new Circle(radius), linearSpeed, angularSpeed, radius * radius));
    } else {
      const verts = Math.round(3 + Math.random() * 5);
      this.#scene.addBody(
        new RigidBody(
          0,
          this.#mousePos.clone(),
          buildCircleContainedPolygon(new Vector2(0, 0), radius, verts),
          linearSpeed,
          angularSpeed,
          radius * radius
        )
      );
    }
  }

  #buildScene() {
    const scene = new Scene();
    scene.addBody(new RigidBody(0, new Vector2(250, 450), new RBBox(400, 20), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(20, 250), new RBBox(20, 300), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(480, 250), new RBBox(20, 300), new Vector2(0, 0), 0, 0));

    const radius = 30.0;
    scene.addBody(new RigidBody(0, new Vector2(250, 50), new Circle(radius), new Vector2(0, 0), 0, radius * radius));

    this.#scene = scene;
  }

  #scene;
  #mousePos;
}

const app = new MyApp(document.getElementById('app'));

//

class MyApp2 extends BrowserApp {
  constructor(divElement) {
    super(divElement);

    this.#mousePos = new Vector2(0, 0);
    this.#buildScene();
  }

  override onClick(e) {
    if (this.isRunning) {
      this.#addBody();
    }
  }

  override onDblclick(_e) {
    this.isRunning = !this.isRunning;
  }

  override onMousemove(e) {
    this.#mousePos = new Vector2(e.offsetX, e.offsetY);
  }

  override onKeydown(e) {
    if (this.isRunning) {
      e.preventDefault();
      this.#addBody();
    }
  }

  override render(dt) {
    this.#scene.step(dt);
    Render.render(this.#scene, this.context as CanvasRenderingContext2D);
  }

  #addBody() {
    const radius = 10.0 + Math.random() * 20;
    const linearSpeed = new Vector2(0, 0);
    const angularSpeed = 0;
    this.#scene.addBody(
      new RigidBody(0, this.#mousePos.clone(), new RBBox(3 * radius, radius), linearSpeed, angularSpeed, radius * radius)
    );
  }

  #buildScene() {
    const scene = new Scene();
    scene.addBody(new RigidBody(0, new Vector2(250, 450), new RBBox(400, 20), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(20, 250), new RBBox(20, 300), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(480, 250), new RBBox(20, 300), new Vector2(0, 0), 0, 0));

    const radius = 30.0;
    scene.addBody(new RigidBody(0, new Vector2(250, 50), new Circle(radius), new Vector2(0, 0), 0, radius * radius));

    this.#scene = scene;
  }

  #scene;
  #mousePos;
}

const app2 = new MyApp2(document.getElementById('app2'));
