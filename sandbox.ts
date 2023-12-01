import './physic/engine.js';
import { buildCircleContainedPolygon } from './physic/geom.js';

import { BrowserApp } from './browser_app.js'
import { Render } from './physic/protocols/protocols.js';
import { Circle } from './physic/circle.js';
import { Box } from './physic/box.js';
import { RigidBody } from './physic/rigidbody.js';
import { Scene } from './physic/scene.js';
import { Vector2 } from './physic/math.js';
import { GameApp, Renderable, Updatable, Services, GameObject } from './game_app.js';


class MyApp extends BrowserApp {
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
    Render.render(this.#scene, this.context as CanvasRenderingContext2D);
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

class MyApp2 extends BrowserApp {
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
    Render.render(this.#scene, this.context as CanvasRenderingContext2D);
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

class StatsDisplay extends GameObject implements Renderable {
  constructor(app: GameApp) {
    super(app);
  }

  register(services: Services): void {
    services.renderingService.register(this);
  }

  render(renderer: CanvasRenderingContext2D): void {
    renderer.font = '10px Arial';
    renderer.fillStyle = 'white';
    renderer.fillText(`FPS: ${this.app.stats.reclaimablesCount}`, 10, 10);
  }
}

class ScoreDisplay extends GameObject implements Renderable, Updatable {
  constructor(app: GameApp) {
    super(app);
  }

  addScore(score: number): void {
    this.#score += score;
  }

  register(services: Services): void {
    services.renderingService.register(this);
    services.updateService.register(this);
  }

  render(renderer: CanvasRenderingContext2D): void {
    const sin: number = Math.sin(this.#angle * 0.1 * Math.PI / 180);

    renderer.textAlign = "center";
    renderer.translate(250, 250);
    renderer.rotate((sin * 45 * Math.PI) / 180);
    renderer.font = '20px Arial';
    renderer.fillStyle = 'white';
    renderer.fillText(`Score: ${this.#score}`, 0, 0);
    renderer.setTransform(1, 0, 0, 1, 0, 0);
  }

  update(dt: number): void {
    this.#angle += dt;
  }

  #angle = 0;
  #score: number = 0;
}

class FallingObject extends GameObject implements Renderable, Updatable {
  constructor(app: GameApp, position: Vector2, radius: number) {
    super(app);
    this.#position = position.clone();
    this.#radius = radius;
    this.#speed = new Vector2(0, Math.random() * 5.0 + 1);
  }

  register(services: Services): void {
    services.renderingService.register(this);
    services.updateService.register(this);
  }

  render(renderer: CanvasRenderingContext2D): void {
    renderer.fillStyle = 'white';
    renderer.beginPath();
    renderer.arc(this.#position.x, this.#position.y, this.#radius, 0, 2 * Math.PI);
    renderer.fill();
  }

  update(dt: number): void {
    this.#position.addToSelf(this.#speed.scale(dt/100));
    if (this.#position.y > 500) {
      this.reclaim();
    }
  }

  #position: Vector2;
  #speed: Vector2;
  #radius: number;
}

class MyGameApp extends GameApp {
  constructor(divElement) {
    super(divElement);
    this.#initialize();
  }

  onDblclick(_e) {
    this.isRunning = !this.isRunning;
  }

  onClick(e) {
    if (this.isRunning) {
      (new FallingObject(this, this.#mousePos, 10)).register(this.services);
    }
  }

  onMousemove(e) {
    this.#mousePos = new Vector2(e.offsetX, e.offsetY);
  }

  #initialize() {
    this.#scoreDisplay = new ScoreDisplay(this);
    this.#scoreDisplay.register(this.services);
    (new StatsDisplay(this)).register(this.services);
  }

  #scoreDisplay: ScoreDisplay;
  #mousePos: Vector2;
}

const app3 = new MyGameApp(document.getElementById('app3'));

