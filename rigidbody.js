import { Vector2 } from "./math.js";
import { Frame } from "./frame.js";

class RigidBody {
  constructor(rotation, position, shape) {
    this.frame = new Frame(rotation, position);
    this.shape = shape;
    this.linearVelocity = new Vector2();
    this.angularVelocity = 0.0;
  }
}

export { RigidBody };
