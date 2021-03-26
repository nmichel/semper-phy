class Object {
  constructor(x = 0, y = 0, alpha = 0) {
    this.x = x;
    this.y = y;
    this.alpha = alpha;
  }

  render(context, dt) {
    throw Error("not implemented");
  }
}

export { Object };
