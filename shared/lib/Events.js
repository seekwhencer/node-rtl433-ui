import {EventEmitter} from 'events';

export default class Events {
    constructor(parent, options) {
        this.event = new EventEmitter();
    }

    on() {
        this.event.on.apply(this.event, Array.from(arguments));
    }

    emit() {
        this.event.emit.apply(this.event, Array.from(arguments));
    }

    removeListener() {
        this.event.removeListener.apply(this.event, Array.from(arguments));
    }

    removeAllListeners() {
        this.event.removeAllListeners.apply(this.event, Array.from(arguments));
    }

    eventNames() {
        return this.event.eventNames.apply(this.event, Array.from(arguments));
    }

    _events() {
        return this.event._events;
    }

    listeners() {
        return this.event.listeners.apply(this.event, Array.from(arguments));
    }
}