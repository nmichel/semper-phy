import { Vector2 } from '../physic/math.js';
import { Registrable, Registry, Service } from './service';

interface EventHandler {
  handleInputState(_inputState: InputState): void;
}

type InputState = {
  mousePos: Vector2;
  eventDbleClick: boolean;
  eventMouseMove: boolean;
  eventKeyDown: boolean;
  eventKeyUp: boolean;
};

const EVENTS = {
  EVENT_MOUSE_MOVE: 'mouse_move',
  EVENT_DBL_CLICK: 'dbl_click',
  EVENT_KEY_DOWN: 'key_down',
} as const;

class EventService extends Registry<Registrable<EventHandler>> implements Service {
  constructor() {
    super();

    this.#inputState = {
      mousePos: new Vector2(0, 0),
      eventDbleClick: false,
      eventMouseMove: false,
      eventKeyDown: false,
      eventKeyUp: false,
    };
  }

  run(): void {
    if (this.#somethingHappened) {
      this.apply(obj => obj.handleInputState(this.#inputState));
      this.#resetState();
    }
  }

  onMousemove(e) {
    this.#inputState.eventMouseMove = true;
    this.#inputState.mousePos = new Vector2(e.offsetX, e.offsetY);
    this.#somethingHappend();
  } 

  onDblclick(_e) {
    this.#inputState.eventDbleClick = true;
    this.#somethingHappend();
  }

  onKeydown(e) {
    this.#inputState.eventKeyDown = true;
    this.#somethingHappend();
  }

  onKeyup(e) {
    this.#inputState.eventKeyUp = true;
    this.#somethingHappend();
  }

  #somethingHappend() {
    this.#somethingHappened = true;
  }

  #resetState() {
    this.#inputState.eventDbleClick = false;
    this.#inputState.eventMouseMove = false;
    this.#inputState.eventKeyDown = false;
    this.#inputState.eventKeyUp = false;
    this.#somethingHappened = false;
  }

  #inputState: InputState;
  #somethingHappened: boolean = false;
}

export { EventService, EventHandler, InputState, EVENTS }
