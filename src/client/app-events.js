import EventEmitter from 'eventemitter3';

let appEventsInstance = null;

export default class AppEvents {
  constructor() {
    if (!appEventsInstance) {
      appEventsInstance = new EventEmitter();
    }

    return appEventsInstance;
  }

  on(eventType, cb) {
    this.eventEmitter.on(eventType, cb);
  }

  emit(eventType) {
    this.eventEmitter.emit(eventType);
  }

  removeAllListeners() {
    this.eventEmitter.removeAllListeners();
  }
}
