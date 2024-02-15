import { groupBy } from './functional.js';
import { clamp, Vector2 } from './math.js';
import * as GfxTools from './gfx.js';

const Control = {
  direction: new Vector2(0, 0),
  position: new Vector2(0, 0),
  offset: 0,
};

class Game {
  constructor() {
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');

    this.control = Control;
    this.canvas = canvas;
    this.context = context;
    this.gameObjects = [];
  }

  init() {}

  update(deltaMs) {
    this.gameObjects.forEach(p => {
      p.update(this, deltaMs);
    });

    this.purge();

    this.control.direction.x = 0;
    this.control.direction.y = 0;
  }

  render(deltaMs) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.gameObjects.forEach(p => {
      p.render(this.context, deltaMs);
    });
  }

  addGameObject(go) {
    this.gameObjects.push(go);
  }

  // Internals

  purge() {
    const { false: gameObjects } = groupBy(this.gameObjects, e => e.deleted);
    this.gameObjects = gameObjects || [];
  }
}

class Brush {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  collide(other) {
    // check for collision between two objects using axis-aligned bounding box (Box)
    // @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }
}

class GameObject {
  constructor() {
    this.id = Math.random() * 10000000000;
    this.deleted = false;
  }

  markeDeleted() {
    this.deleted = true;
  }

  update(game, deltaMs) {}

  render(context) {}
}

class Collidable extends GameObject {
  constructor() {
    super();
  }

  getBrush() {
    throw 'Not implemented';
  }

  collide(other) {
    const myBrush = this.getBrush();
    const otherBrush = other.getBrush();

    return myBrush.collide(otherBrush);
  }

  onHit(game) {}
}

class Paddle extends Collidable {
  constructor(x, y, color = '#f5f5f5') {
    super();

    this.halfHeight = 3;
    this.halfWidth = 17;
    this.pos = new Vector2(x, y);
    this.paddleSurfaceY = this.y - this.halfHeight;
    this.color = color;

    this.targetSize = 0;
    this.step = 0;
  }

  // GameObject

  update(game, deltaMs) {
    this.move(game);
  }

  render(context) {
    context.fillStyle = this.color;
    context.fillRect(this.pos.x - this.halfWidth, this.pos.y - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
  }

  // Collidable

  getBrush() {
    return new Brush(this.pos.x - this.halfWidth, this.pos.y - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
  }

  onHit(game) {}

  // Internals

  move(game) {
    this.pos.addToSelf(game.control.direction.scale(game.control.offset));
  }
}

Paddle.SIZE_SPEED = 0.3;

class Star extends GameObject {
  constructor(position, speed) {
    super();

    this.lifeMs = 0;
    this.direction = new Vector2(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0);
    this.direction.normalizeSelf();
    this.position = position.clone();
    this.speed = speed;
    this.acceleration = 0.0001;
    this.radius = (this.speed / 0.3) * 10;
  }

  update(game, deltaMs) {
    this.lifeMs += deltaMs;
    if (this.lifeMs > 2000) {
      this.deleted = true;
    }

    this.position.addToSelf(this.direction.scale((this.speed + this.acceleration * this.lifeMs) * deltaMs));
  }

  render(context) {
    GfxTools.drawDisc(context, this.position.x, this.position.y, this.radius, `rgba(${(1.0 - this.lifeMs / 2000) * 255}, 0, 0, 1)`);
  }
}

class StarSource extends GameObject {
  constructor() {
    super();

    this.deltaMs = 0;
    this.center = new Vector2(200, 200);
    this.factor = 0.1;
  }

  update(game, deltaMs) {
    this.deltaMs += deltaMs;

    if (this.deltaMs > 1) {
      this.deltaMs = 0;
      for (let i = 0; i < Math.max(deltaMs, 30); ++i) {
        game.addGameObject(new Star(this.center, Math.random() * 0.3));
      }
    }

    this.center = game.control.position.clone();
    this.center.x = clamp(this.center.x, 100, 300);
    this.center.y = clamp(this.center.y, 100, 300);
  }

  render(context) {}
}

const game = new Game();
game.init();
// game.addGameObject(new Paddle(100, 100));
game.addGameObject(new StarSource());

let prevTs = performance.now();

function loop(ts) {
  const deltaMs = ts - prevTs;
  game.update(deltaMs);
  game.render(deltaMs);
  prevTs = ts;

  requestAnimationFrame(loop);
}

const canvas = document.getElementById('game');
canvas.addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(e) {
  const mouseMovementX = e.movementX;
  const mouseMovementY = e.movementY;

  const rect = canvas.getBoundingClientRect();
  Control.position = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
  const direction = new Vector2(mouseMovementX, mouseMovementY);
  Control.direction = direction;
  Control.offset = Control.direction.length();
}

requestAnimationFrame(loop);
