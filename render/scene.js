class Scene {
  constructor(context) {
    this.context = context;
    this.objects = [];
  }

  addObject(object) {
    this.objects.push(object);
  }

  render(dt) {
    this.objects.forEach(object => {
      object.render(this.context, dt);
    });
  }
}

export { Scene };
