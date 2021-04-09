
import { Object as SceneObject } from '../../../render/object.js';

import { Object as GameObject } from '../../../game/object.js';

import { RigidBody } from '../../../physic/rigidbody.js';
import { AABB } from '../../../physic/aabb.js';
import { Vector2 } from '../../../physic/math.js';

const renderScale = 5;

class TableRenderObject extends SceneObject {
  constructor(w, h, thick) {
    super(0, 0);

    this.w = w;
    this.h = h;
    this.thick = thick;
  }

  render(ctxt, dt) {
    const r = 20;
    const x = 0;
    const y = 0;
    const h = this.h * 100;
    const w = this.w * 100;
    const thick = this.thick * 100;

    ctxt.save();
      ctxt.scale(renderScale, renderScale);
      drawRoundRect(ctxt, x, y, h, w, r);
      ctxt.fillStyle = '#42280E';
      ctxt.fill();

      ctxt.fillStyle = '#050';
      ctxt.fillRect(thick, thick, w - 2 * thick, h - 2 * thick);

      ctxt.fillStyle = '#080';
      ctxt.fillRect(12.7, 19, 5.1, 99)
    ctxt.restore();
  }
}

function drawRoundRect(ctxt, x, y, h, w, r) {
  ctxt.beginPath();
  ctxt.moveTo(x+r, y);
  ctxt.arcTo(x+w, y,   x+w, y+h, r);
  ctxt.arcTo(x+w, y+h, x,   y+h, r);
  ctxt.arcTo(x,   y+h, x,   y,   r);
  ctxt.arcTo(x,   y,   x+w, y,   r);
  ctxt.closePath();
}

class Table extends GameObject {
  constructor(w, h, thick) {
    const hh = h/2;
    const hw = w/2;
    const hthick = thick/2;
    const borders = 
      [
        new RigidBody(0, new Vector2(hw, hthick), new AABB(w, thick), new Vector2(0, 0), 0, 0),
        new RigidBody(0, new Vector2(hw, h - hthick), new AABB(w, thick), new Vector2(0, 0), 0, 0),
        new RigidBody(0, new Vector2(hthick, hh), new AABB(thick, h), new Vector2(0, 0), 0, 0),
        new RigidBody(0, new Vector2(w - hthick, hh), new AABB(thick, h), new Vector2(0, 0), 0, 0)
      ]

    super(borders, new TableRenderObject(w, h, thick));
  }

  physicUpdate() {
  }
}


export { Table };
