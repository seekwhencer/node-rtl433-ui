export default class Log {
    constructor() {
        window.LOG_PARENT = console.log;
        console.log = this.log;
    }

    log() {
        if (!window.OPTIONS)
            return;

        if (!window.OPTIONS.debug)
            return;

        window.LOG_PARENT.apply(this, arguments);
    }
}

window.LOG = new Log().log;
