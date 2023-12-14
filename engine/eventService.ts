import { Vector2 } from '../physic/math.js';
import { HasId, Service } from './service';

const EVENTS_NAMES = {
  EVENT_MOUSE_DOWN: 'event_mouse_down',
  EVENT_MOUSE_UP: 'event_mouse_up',
  EVENT_MOUSE_MOVE: 'event_mouse_move',
  EVENT_DBL_CLICK: 'event_dbl_click',
  EVENT_KEY_DOWN: 'event_key_down',
  EVENT_KEY_UP: 'event_key_up',
} as const;

const EVENTS = [
  EVENTS_NAMES.EVENT_MOUSE_DOWN, EVENTS_NAMES.EVENT_MOUSE_UP,
  EVENTS_NAMES.EVENT_DBL_CLICK, EVENTS_NAMES.EVENT_MOUSE_MOVE, EVENTS_NAMES.EVENT_KEY_DOWN, EVENTS_NAMES.EVENT_KEY_UP
] as const; 

type InputState = {
  mousePos: Vector2;
  buttonLeft: boolean;
} & { [key in typeof EVENTS[number]]: boolean };

type EventHandler = (_inputState: InputState) => void;

type EventMap = {
  [key in typeof EVENTS[number]]?: EventHandler;
};

class EventService implements Service {
  constructor() {

    this.#inputState = {
      mousePos: new Vector2(0, 0),
      buttonLeft: false,
      event_dbl_click: false,
      event_mouse_down: false,
      event_mouse_up: false,
      event_mouse_move: false,
      event_key_down: false,
      event_key_up: false,
    };

    this.#eventMaps = {
      [EVENTS_NAMES.EVENT_DBL_CLICK]: [],
      [EVENTS_NAMES.EVENT_MOUSE_DOWN]: [],
      [EVENTS_NAMES.EVENT_MOUSE_UP]: [],
      [EVENTS_NAMES.EVENT_MOUSE_MOVE]: [],
      [EVENTS_NAMES.EVENT_KEY_DOWN]: [],
      [EVENTS_NAMES.EVENT_KEY_UP]: [],
    };
  }

  register(handler: HasId, eventMap: EventMap): void {
    Object.entries(eventMap).forEach(([eventName, callback]) => {
      this.#eventMaps[eventName].push([handler.id, callback]);
    });
  }

  unregister(searchedId: number): void {
    for (const key of EVENTS) {
      const idx = this.#eventMaps[key].findIndex(([id, _callback]: [number, EventHandler]) => id === searchedId);
      if (idx !== -1) {
        this.#eventMaps[key].splice(idx, 1);
      }
    }
  }


  run(): void {
    if (this.#somethingHappened) {
      for (const key of EVENTS) {
        if (this.#inputState[key]) {
          this.#eventMaps[key].forEach(([id, callback]) => {
            callback({...this.#inputState});
          });
        }
      }
      this.#resetState();
    }
  }

  onMouseDown(e) {
    this.#inputState.buttonLeft = true;
    this.#inputState.event_mouse_down = true;
    this.#somethingHappend();
  }

  onMouseUp(e) {
    this.#inputState.buttonLeft = false;
    this.#inputState.event_mouse_up = true;
    this.#somethingHappend();
  }

  onMousemove(e) {
    this.#inputState.event_mouse_move = true;
    this.#inputState.mousePos = new Vector2(e.offsetX, e.offsetY);
    this.#somethingHappend();
  } 

  onDblclick(_e) {
    this.#inputState.event_dbl_click = true;
    this.#somethingHappend();
  }

  onKeydown(e) {
    this.#inputState.event_key_down = true;
    this.#somethingHappend();
  }

  onKeyup(e) {
    this.#inputState.event_key_up = true;
    this.#somethingHappend();
  }

  #somethingHappend() {
    this.#somethingHappened = true;
  }

  #resetState() {
    this.#inputState.event_dbl_click = false;
    this.#inputState.event_mouse_move = false;
    this.#inputState.event_mouse_down = false;
    this.#inputState.event_mouse_up = false;
    this.#inputState.event_key_down = false;
    this.#inputState.event_key_up = false;
    this.#somethingHappened = false;
  }

  #inputState: InputState;
  #somethingHappened: boolean = false;
  #eventMaps: { [key in typeof EVENTS[number]]: [number, EventHandler][]};
}

export { EventService, EventHandler, InputState, EVENTS, EVENTS_NAMES }
