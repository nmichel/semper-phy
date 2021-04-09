class Object {
  // constructor([RigidBody], SceneObject)
  constructor(rigidBodies, renderObject) {
    this.rigidBodies = rigidBodies;
    this.renderObject = renderObject;

    rigidBodies && rigidBodies.forEach(rb => rb.addListener(this.physicUpdate.bind(this)));
  }

  getRigidbodies() {
    return this.rigidBodies;
  }

  getRenderObject() {
    return this.renderObject;
  }

  physicUpdate() {
    throw new Error("not implemented");
  }
}

export { Object };
