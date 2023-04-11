import Crypto from 'crypto';
import DeviceTopic from './DeviceTopic.js';

export default class RTL433Device extends MODULECLASS {
    constructor(parent, deviceData) {
        super(parent);
        this.label = 'RTL433 DEVICE';
        this.parent = parent;
        this.topicsMapping = this.parent.topicsMapping;

        // a device can have multiple topics on different value fields
        this.topics = [];
        this.is_excluded = false;

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
            const eventNames = this.eventNames();
            const events = this._events(this);
            const field = topic.data.field;
            LOG(this.label, 'EVENTS', eventNames, events, '');

            this.removeAllListeners(field);
            this.topics = this.topics.filter(t => topic.data.topic !== t.data.topic);
        });



        //eventNames.forEach(eventName => this.removeAllListeners(eventName));
    }

    emitIntital() {
        // emit on create
        Object.keys(this.dataSource).forEach(field => this.emit(field, this.data[field]));
    }

}