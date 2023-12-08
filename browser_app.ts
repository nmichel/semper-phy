class BrowserApp {
  constructor(divElement) {
    this.#divElement = divElement;
    this.#divElement.setAttribute('tabindex', '0');
    this.#canvasElement = document.createElement('canvas');
    this.#canvasElement.setAttribute('tabindex', '0');
    this.#divElement.appendChild(this.#canvasElement);
    this.#context = this.#canvasElement.getContext('2d', { alpha: false });
    this.#canvasElement.width = this.#divElement.clientWidth;
    this.#canvasElement.height = this.#divElement.clientHeight;
    
    this.#binEvents();
  }

  onClick(e) {}
  onDblclick(e) {}
  onMousemove(e) {}
  onMouseout(e) {
    this.#isRunning = false;
  }
  onKeydown(e) {}

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
    this.#divElement.addEventListener('mouseout', this.onMouseout.bind(this));
    this.#divElement.addEventListener('click', this.onClick.bind(this));
    this.#divElement.addEventListener('dblclick', this.onDblclick.bind(this));
    this.#divElement.addEventListener('mousemove', this.onMousemove.bind(this));
    this.#divElement.addEventListener('keydown', this.onKeydown.bind(this), true);

    if (this.#isRunning) {
      this.#prevTs = performance.now();
      requestAnimationFrame(this.#loop.bind(this));
    }
  }

  #divElement;
  #canvasElement;
  #context;
  #prevTs;
  #isRunning = false;
}

export { BrowserApp };