
class ImageResource {
  constructor() {
    this.image = null;
  }
}

class ImageManager {
  constructor() {
    this.resources = {};
  }

  addResource(name) {
    const resource = new ImageResource();
    const img = new Image();
    img.src = name;
    img.onload = (_event) => {
      resource.image = img;
    }
    this.resources[name] = resource;
  }

  getImage(name) {
    return this.resources[name];
  }
};

export { ImageManager, ImageResource };
