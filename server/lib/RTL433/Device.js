import Crypto from 'crypto';
import DeviceTopic from './DeviceTopic.js';

export default class RTL433Device extends MODULECLASS {
    constructor(parent, deviceData) {
        super(parent);
        this.parent = parent;
        this.label = 'RTL433 DEVICE';

        // a device can have multiple topics on different value fields
        this.topics = [];

        this.dataSource = deviceData;
        this.data = new Proxy(this.dataSource, {
            get: (target, prop, receiver) => {
                return target[prop] || this.dataSource[prop];
            },
            set: (target, prop, value) => {
                if (target[prop] !== value) {
                    target[prop] = value;

                    // emit the prop
                    this.emit(prop, value);
                }
                return true;
            }
        });

        this.data.hash = `${Crypto.createHash('md5').update(`${this.data.id}${this.data.model}${this.data.channel}${this.data.protocol}${this.data.button}`).digest("hex")}`;
        this.time_create = this.data.time;
        this.getTopics();
    }

    /**
     * find all topics for the device
     */
    getTopics() {
        this.removeTopics();

        this.topics = [];
        this.topicsMapping.forEach(topic => {
            const t = {...topic}; // make a copy

            // without the topic and the value field
            delete t.topic;
            delete t.field;

            let matchA = '', matchB = '';

            // all other matching definitions like `id`, `protocol` or `channel`
            Object.keys(t).forEach(key => {
                matchA += t[key];
                matchB += this.data[key];
            });

            if (`${matchA}` === `${matchB}`) {
                const deviceTopic = new DeviceTopic(this, topic);
                this.topics.push(deviceTopic);
            }
        });
    }

    /**
     * remove the existing event listeners for property update
     */
    removeTopics() {
        this.topics.forEach(topic => {
            const field = topic.data.field;

            //const eventNames = this.eventNames();
            //const events = this._events(this);
            //LOG(this.label, 'EVENTS', eventNames, events, '');

            this.removeAllListeners(field);
            this.topics = this.topics.filter(t => topic.data.topic !== t.data.topic);
        });
    }

    emitInitial() {
        // emit on create
        Object.keys(this.dataSource).forEach(field => this.emit(field, this.data[field]));
    }

    checkExcluded() {
        if (this.excludes.hashes.includes(this.data.hash) || this.excludes.models.includes(this.data.model)) {
            // remove the device
            this.remove();
        }
    }

    remove() {
        this.removeTopics();
        Object.keys(this.data).forEach(field => this.removeAllListeners(field));
        this.parent.removeDevice(this);
    }

    checkAge() {
        const create = new Date(this.time_create).getTime();
        const now = Date.now();
        this.data.age = parseInt((now - create) / 1000);

        if (this.topics.length === 0) {
            this.data.livetime = (DEVICE_UNMAPPED_AGE_MAX || 120) - this.data.age;
        } else {
            this.data.livetime = 'always';
        }

        if (this.data.livetime < 0)
            this.data.livetime = 0;

        if (this.data.livetime === 0 && this.parent.forget)
            this.remove();
    }

    get topicsMapping() {
        return this.parent.topics.data;
    }

    set topicsMapping(val) {
        // nothing
    }

    get excludes() {
        return this.parent.excludes;
    }

    set excludes(val) {
        // nothing
    }


}