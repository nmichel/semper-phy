class BrowserApp {
  constructor(divElement) {
    const canvasContainerElt = document.createElement('div');
    canvasContainerElt.setAttribute('tabindex', '0');
    this.#canvasElement = document.createElement('canvas');
    this.#canvasElement.setAttribute('tabindex', '0');
    canvasContainerElt.appendChild(this.#canvasElement);
    divElement.appendChild(canvasContainerElt);
    this.#context = this.#canvasElement.getContext('2d', { alpha: false });
    this.#canvasElement.width = divElement.clientWidth;
    this.#canvasElement.height = divElement.clientHeight;
    this.#divElement = divElement;
    this.#canvasContainerElt = canvasContainerElt;
  }

  start() {
    this.#isRunning = true; // DO NOT use the setter here

    this.#binEvents();
  }

  onClick(_e) {}
  onDblclick(_e) {}
  onMousemove(_e) {}
  onMousedown(_e) {}
  onMouseup(_e) {}
  onMouseout(_e) {
    this.#isRunning = false;
  }
  onKeydown(_e) {}
  onKeyup(_e) {}
  onContextMenu(e) {
    e.preventDefault();
  }

  get isRunning() {
    return this.#isRunning;
  }

  set isRunning(flag) {
    this.#isRunning = flag;

    if (this.#isRunning) {
      this.#canvasElement.focus();
      this.#prevTs = performance.now();
      requestAnimationFrame(this.#loop.bind(this));
    }
  }

  get context() {
    return this.#context;
  }

  get container() {
    return this.#divElement;
  }

  render(deltaMs) {
    throw new Error('not implemented');
  }

  #loop(ts) {
    if (this.#isRunning) {
      const deltaMs = ts - this.#prevTs;

      this.context.clearRect(0, 0, this.#canvasElement.width, this.#canvasElement.height);

      this.render(deltaMs);

      this.#prevTs = ts;
      requestAnimationFrame(this.#loop.bind(this));
    }
  }

  #binEvents() {
    this.#canvasContainerElt.addEventListener('mousedown', this.onMousedown.bind(this));
    this.#canvasContainerElt.addEventListener('mouseup', this.onMouseup.bind(this));
    this.#canvasContainerElt.addEventListener('mouseout', this.onMouseout.bind(this));
    this.#canvasContainerElt.addEventListener('click', this.onClick.bind(this));
    this.#canvasContainerElt.addEventListener('dblclick', this.onDblclick.bind(this));
    this.#canvasContainerElt.addEventListener('mousemove', this.onMousemove.bind(this));
    this.#canvasContainerElt.addEventListener('keydown', this.onKeydown.bind(this), true);
    this.#canvasContainerElt.addEventListener('keyup', this.onKeyup.bind(this), true);
    this.#canvasContainerElt.addEventListener('contextmenu', this.onContextMenu.bind(this));

    if (this.#isRunning) {
      this.#prevTs = performance.now();
      requestAnimationFrame(this.#loop.bind(this));
    }
  }

  #divElement;
  #canvasContainerElt;
  #canvasElement;
  #context;
  #prevTs;
  #isRunning = false;
}

export { BrowserApp };
