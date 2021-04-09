import { Object as SceneObject } from '../../../render/object.js';

import { Object as GameObject } from '../../../game/object.js';

import { RigidBody } from '../../../physic/rigidbody.js';
import { Circle } from '../../../physic/circle.js';
import { Vector2 } from '../../../physic/math.js';
import { toRadians } from '../../../physic/math.js';


const renderScale = 5;

const ball_mass = 0.162;

class BallRenderObject extends SceneObject {
  constructor(radius, imageResource, x, y) {
    super(x, y);
    this.imageResource = imageResource;
    this.radius = radius;
  }

  render(ctxt, dt) {
    const alpha = toRadians(this.alpha);
    const radius = this.radius * 100 * renderScale;

    ctxt.save();
      ctxt.strokeStyle = 'white';
      ctxt.fillStyle = '#444';
      ctxt.lineWidth = 2;
      ctxt.translate(this.x, this.y);
      ctxt.beginPath();
      ctxt.rotate(alpha);
      ctxt.arc(0, 0, radius, 0, 2 * Math.PI, true);
      ctxt.fill();

      const img = this.imageResource.image;
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

class Ball extends GameObject {
  constructor(radius, imageResource, x, y) {
    super(
      [new RigidBody(0, new Vector2(x, y), new Circle(radius), new Vector2(), 0, ball_mass)],
      new BallRenderObject(radius, imageResource, x, y));
  }

  physicUpdate() {
    this.renderObject.x = this.rigidBodies[0].frame.position.x * renderScale * 100;
    this.renderObject.y = this.rigidBodies[0].frame.position.y * renderScale * 100;
    this.renderObject.alpha = this.rigidBodies[0].frame.rotation;
  }
};

export { Ball };
