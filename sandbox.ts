import './physic/engine.js';
import { buildCircleContainedPolygon } from './physic/shapes/geom.js';

import { BrowserApp } from './browser_app.js';
import { Render } from './physic/protocols/protocols';
import { Circle } from './physic/shapes/Circle.js';
import { Box } from './physic/shapes/Box.js';
import { RigidBody } from './physic/Rigidbody.js';
import { Scene } from './physic/Scene.js';
import { Vector2 } from './physic/Math.js';
import { Options } from './physic/protocols/Render.js';

class MyApp extends BrowserApp {
  constructor(divElement) {
    super(divElement);

    this.#mousePos = new Vector2(0, 0);
    this.#buildScene();
    this.#initializeControls();
  }

  override onClick(e): void {
    if (super.isRunning) {
      this.#addBody();
    }
  }

  override onMousemove(e) {
    this.#mousePos = new Vector2(e.offsetX, e.offsetY);
  }

  override onMouseout(_e) {}

  override onKeydown(e) {
    if (super.isRunning) {
      e.preventDefault();
      this.#addBody();
    }
  }

  override render(dt) {
    this.#scene.step(dt);
    Render.render(this.#scene, super.context as CanvasRenderingContext2D, this.#opts);
  }

  /*
  #addBody() {
    const radius = 10.0 + Math.random() * 20;
    let body: RigidBody;
    if (Math.random() > 0.6) {
      body = new RigidBody(new Circle(radius), radius * radius);
    } else {
      const verts = Math.round(3 + Math.random() * 5);
      body = new RigidBody(buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), radius * radius);
    }
    body.position = this.#mousePos.clone();
    this.#scene.addBody(body);
  }
  */

  #addBody() {
    let body: RigidBody = new RigidBody(new Box(50, 20), 1);
    body.position = this.#mousePos.clone();
    // body.rotation = 0.1;
    this.#scene.addBody(body);
  }

  #buildScene() {
    const scene = new Scene();
    const floor = new RigidBody(new Box(800, 20), 0);
    floor.position = new Vector2(430, 450);
    scene.addBody(floor);

    const leftWall = new RigidBody(new Box(20, 400), 0);
    leftWall.position = new Vector2(20, 250);
    scene.addBody(leftWall);

    const rightWall = new RigidBody(new Box(20, 400), 0);
    rightWall.position = new Vector2(840, 250);
    scene.addBody(rightWall);

    const rampLeft = new RigidBody(new Box(190, 25), 0);
    rampLeft.position = new Vector2(150, 250);
    rampLeft.rotation = -0.39;
    scene.addBody(rampLeft);

    const rampRight = new RigidBody(new Box(190, 25), 0);
    rampRight.position = new Vector2(350, 250);
    rampRight.rotation = 0.39;
    scene.addBody(rampRight);
    /*
    let body: RigidBody = new RigidBody(new Box(100, 50), 1);
    body.position = new Vector2(200, 0);
    scene.addBody(body);

    {
      const radius = 30.0;
      const ball = new RigidBody(new Circle(radius), 1);
      ball.position = new Vector2(250, 150);
      scene.addBody(ball);
    }

    {
      const radius = 15.0;
      const ball = new RigidBody(new Circle(radius), 1);
      ball.position = new Vector2(300, 150);
      scene.addBody(ball);
    }
    */

    // Block
    const box = 5.0;
    const radius = 4.0;
    const yBase = 0;
    for (let row = 1; row <= 15; row++) {
      const y = yBase + row * (box * 2);
      const xBase = 100;
      for (let col = 0; col < 30; col++) {
        const x = xBase + col * (box * 2);
        let body: RigidBody;
        if (col < 15) {
          body = new RigidBody(new Circle(radius), radius * radius);
        } else {
          body = new RigidBody(new Box(radius * 2, radius), radius * radius);
        }
        body.position = new Vector2(x, y);
        scene.addBody(body);
      }
    }

    // Pyramid
    /*
    const box = 5.0;
    const radius = 4.0;
    const yBase = 140;
    for (let row = 1; row <= 30; row++) {
      const y = yBase + row * (box*2);
      const xBase = 75 - Math.floor(row * radius);
      for (let col = 1; col <= row; col++) {
        const x = xBase + col * (box*2);
        const body = new RigidBody(new Circle(radius), radius * radius);
        body.position = new Vector2(150 + x, y);
        scene.addBody(body);
      }
    }
    */

    this.#scene = scene;
  }

  #initializeControls() {
    const elt = this.container.querySelector('.run');
    elt.addEventListener('change', e => {
      this.isRunning = elt.checked;
    });

    this.#bindDebugToggle('.debug', 'enabled');
    this.#bindDebugToggle('.show_aabb', 'showAABB');
    this.#bindDebugToggle('.show_frames', 'showFrame');
    this.#bindDebugToggle('.show_edges', 'showEdges');
    this.#bindDebugToggle('.show_vertices', 'showVertices');
    this.#bindDebugToggle('.show_normals', 'showNormals');
    this.#bindDebugToggle('.show_trail', 'showTrail');
  }

  #bindDebugToggle(className: string, propName: string) {
    const elt = this.container.querySelector(className);
    elt.checked = false;
    elt.addEventListener(
      'change',
      e => {
        e.stopPropagation();
        this.#opts.debug[propName] = elt.checked;
      },
      true
    );
  }

  #scene;
  #mousePos;
  #opts: Options = {
    debug: {
      enabled: false,
      showAABB: false,
      showFrame: false,
      showEdges: false,
      showVertices: false,
      showNormals: false,
      showTrail: false,
    },
  };
}

const app = new MyApp(document.getElementById('app'));
app.start();
