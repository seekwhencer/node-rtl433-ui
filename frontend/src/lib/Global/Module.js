import {EventEmitter} from 'events';

export default class Module {

    constructor(parent, options) {
        this.name = 'module';
        this.ready = false;
        this.options = options;
        this.defaults = {};
        this.event = new EventEmitter();

        parent ? this.parent = parent : null;
        this.parent ? this.parent.app ? this.app = this.parent.app : null : null;
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

    get(match, not) {
        return this.items.filter(item => {
            if (item.id === match) {
                return not !== item.id;

            }
        })[0];
    }

    getF(field, match, not) {
        return this.items.filter(item => {
            if (item[field] === match) {
                return not !== item[field];

            }
        })[0];
    }

    toDOM(string) {
        // @TODO - not the first -> all !!!.
        const body = new DOMParser().parseFromString(string, "text/html").documentElement.querySelector('body');

        if (body.children.length > 1) {
            return body.children; // is a NodeList
        }
        return body.firstChild; // is a node
    }

    /**
     * data could be a child or a HTMLCollection
     * @param data
     */
    append(data, target) {
        if (data.length > 1) {
            data.forEach(i => target.append(i));
        } else {
            target.append(data);
        }

        return target;

    }

    fetch(url, requestOptions) {
        !requestOptions ? requestOptions = {
            method: 'GET'
        } : null;

        return fetch(url, requestOptions)
            .then(response => {
                if (!response.ok)
                    return Promise.reject(response.statusText);

                return response.json();
            });
    }

    fetchAudio(url, requestOptions) {
        !requestOptions ? requestOptions = {
            method: 'GET'
        } : null;

        return fetch(url, requestOptions)
            .then(response => {
                if (!response.ok)
                    return Promise.reject(response.statusText);

                return response.blob();
            });
    }

}
