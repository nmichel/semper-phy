import './physic/engine.js';
import { buildCircleContainedPolygon } from './physic/geom.js';

import { BrowserApp } from './browser_app.js'
import { Render } from './physic/protocols/protocols.js';
import { Circle } from './physic/circle.js';
import { Box as RBBox} from './physic/box.js';
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
      this.#scene.addBody(new RigidBody(0, this.#mousePos.clone(), new Circle(radius), linearSpeed, angularSpeed, radius*radius));
    }
    else {
      const verts = Math.round(3 + Math.random() * 5);
      this.#scene.addBody(new RigidBody(0, this.#mousePos.clone(), buildCircleContainedPolygon(new Vector2(0, 0), radius, verts), linearSpeed, angularSpeed, radius*radius));
    }
  }

  #buildScene() {
    const scene = new Scene();
    scene.addBody(new RigidBody(0, new Vector2(250, 450), new RBBox(400, 20), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(20, 250), new RBBox(20, 300), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(480, 250), new RBBox(20, 300), new Vector2(0, 0), 0, 0));
  
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
    this.#scene.addBody(new RigidBody(0, this.#mousePos.clone(), new RBBox(3*radius, radius), linearSpeed, angularSpeed, radius*radius));
  }

  #buildScene() {
    const scene = new Scene();
    scene.addBody(new RigidBody(0, new Vector2(250, 450), new RBBox(400, 20), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(20, 250), new RBBox(20, 300), new Vector2(0, 0), 0, 0));
    scene.addBody(new RigidBody(0, new Vector2(480, 250), new RBBox(20, 300), new Vector2(0, 0), 0, 0));
  
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

  override register(services: Services): void {
    services.renderingService.register(this);
  }

  /**
   * From Renderable
   */
  render(renderer: CanvasRenderingContext2D): void {
    renderer.font = '10px Courier New';
    renderer.translate(40, 20);
    renderer.fillStyle = 'rgba(0, 0, 255, 0.5)';
    renderer.fillRect(0, 0, 400, 85);
    renderer.fillStyle = 'white';
    renderer.translate(10, 5);
    renderer.fillText(`reclaimablesCount:             ${this.app.stats.reclaimablesCount}`, 0, 10);
    renderer.fillText(`reclaimabledInLastFrameCount:  ${this.app.stats.reclaimabledInLastFrameCount}`, 0, 30);
    renderer.fillText(`reclaimabledTotalCount:        ${this.app.stats.reclaimabledTotalCount}`, 0, 50);
    renderer.fillText(`lastFrameDuration:             ${this.app.stats.lastFrameDuration}`, 0, 70);
    renderer.setTransform(1, 0, 0, 1, 0, 0);
  }
}

class ScoreDisplay extends GameObject implements Renderable, Updatable {
  constructor(app: GameApp) {
    super(app);
  }

  addScore(score: number): void {
    this.#score += score;
  }

  override register(services: Services): void {
    services.renderingService.register(this);
    services.updateService.register(this);
  }

  /**
   * From Renderable
   */
  render(renderer: CanvasRenderingContext2D): void {
    const sin: number = Math.sin(this.#angle * 0.1 * Math.PI / 180);

    const prevTextAlign = renderer.textAlign;
    renderer.textAlign = "center";
    renderer.translate(250, 250);
    renderer.rotate((sin * 45 * Math.PI) / 180);
    renderer.font = '20px Arial';
    renderer.fillStyle = 'white';
    renderer.fillText(`Score: ${this.#score}`, 0, 0);
    renderer.setTransform(1, 0, 0, 1, 0, 0);
    renderer.textAlign = prevTextAlign;
  }

  /**
   * From Updatable
   */
  update(dt: number): void {
    this.#angle += dt;
  }

  #angle = 0;
  #score: number = 0;
}

class PhysicEngineGameObject extends GameObject implements Updatable, Renderable {
  constructor(app: GameApp, engine: Scene) {
    super(app);

    this.#engine = engine;
    this.#debug = false;
  }

  override register(services: Services): void {
    services.updateService.register(this);
    services.renderingService.register(this);
  }

  /**
   * From Updatable
   */
  update(dt: number): void {
    this.#engine.step(dt);
  }

  /**
   * From Renderable
   */
  render(renderer: CanvasRenderingContext2D): void {
    if (this.#debug) {
      Render.render(this.#engine, renderer);
    }
  }

  #engine: Scene;
  #debug: boolean;
}

class RigidBodyGameObject extends GameObject implements Renderable {
  constructor(app: GameApp, body: RigidBody, engine: Scene) {
    super(app);
    this.#body = body;
    this.#engine = engine;

    this.#engine.addBody(this.#body);
    this.#body.addListener(this.#handleRigibodyEvent.bind(this));
  }

  /**
   * From GameObject
   */
  override reclaim(): void {
    this.#engine.removeBody(this.#body);
    super.reclaim();
  }

  /**
   * From Renderable
  */
  render(renderer: CanvasRenderingContext2D): void {
    renderer.translate(this.#position.x, this.#position.y);
    renderer.rotate(this.#rotation * Math.PI / 180);

    this.localRender(renderer)

    renderer.setTransform(1, 0, 0, 1, 0, 0);
  }

  localRender(_renderer: CanvasRenderingContext2D): void {}

  #handleRigibodyEvent() {
    this.#position = this.#body.frame.position.clone();
    this.#rotation = this.#body.frame.rotation;
  }

  #body: RigidBody;
  #engine: Scene;
  #position: Vector2;
  #rotation: number = 0;
}

class Box extends RigidBodyGameObject {
  constructor(app: GameApp, engine: Scene, position: Vector2, side: number) {
    super(app, new RigidBody(0, position.clone(), new RBBox(side, side), new Vector2(0, Math.random() * 5.0 + 1), 0, side * side), engine);

    this.#side = side;
  }

  override register(services: Services): void {
    services.renderingService.register(this);
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.fillStyle = 'white';
    renderer.fillRect(-this.#side / 2, -this.#side / 2, this.#side, this.#side);
  }

  #side: number;
}


class Ball extends RigidBodyGameObject {
  constructor(app: GameApp, engine: Scene, position: Vector2, radius: number) {
    super(app, new RigidBody(0, position.clone(), new Circle(radius), new Vector2(0, Math.random() * 5.0 + 1), 0, 100), engine);

    this.#radius = radius;
  }

  override register(services: Services): void {
    services.renderingService.register(this);
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.fillStyle = 'white';
    renderer.beginPath();
    renderer.arc(0, 0, this.#radius, 0, 2 * Math.PI);
    renderer.fill();
  }

  #radius: number;
}

class Wall extends RigidBodyGameObject {
  constructor(app: GameApp, engine: Scene, position: Vector2, width: number, height: number) {
    super(app, new RigidBody(0, position.clone(), new RBBox(width, height), new Vector2(0, 0), 0, 0), engine);

    this.#width = width;
    this.#height = height;
  }

  override register(services: Services): void {
    services.renderingService.register(this);
  }

  override localRender(renderer: CanvasRenderingContext2D): void {
    renderer.fillStyle = 'white';
    renderer.fillRect(-this.#width / 2, -this.#height / 2, this.#width, this.#height);
  }

  #width: number;
  #height: number;
}

class MyGameApp extends GameApp {
  constructor(divElement) {
    super(divElement);

    this.#physicScene = new Scene();

    this.#scoreDisplay = new ScoreDisplay(this);
    new StatsDisplay(this);
    new PhysicEngineGameObject(this, this.#physicScene)

    new Wall(this, this.#physicScene, new Vector2(250, 450), 450, 20);
    new Wall(this, this.#physicScene, new Vector2(20, 250), 20, 400);
    new Wall(this, this.#physicScene, new Vector2(480, 250), 20, 400);
  }

  override onDblclick(_e) {
    this.isRunning = !this.isRunning;
  }

  override onMousemove(e) {
    this.#mousePos = new Vector2(e.offsetX, e.offsetY);
  }

  override onKeydown(e) {
    if (this.isRunning) {
      // new Box(this, this.#physicScene, this.#mousePos, 10 + Math.random() * 20);
      new Ball(this, this.#physicScene, this.#mousePos, 10 + Math.random() * 20);
      this.#scoreDisplay.addScore(1);
    }
  }

  #scoreDisplay: ScoreDisplay;
  #mousePos: Vector2;
  #physicScene: Scene = new Scene();
}

const app3 = new MyGameApp(document.getElementById('app3'));

