import TopicTemplate from './Templates/Topic.html';

export default class Topic extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.topics = parent;
        this.label = 'TOPIC';

        this.dataSource = options;
        this.data = new Proxy(this.dataSource, {
            get: (target, prop, receiver) => {
                return target[prop] || this.dataSource[prop];
            },
            set: (target, prop, value) => {
                if (target[prop] === value)
                    return true;

                target[prop] = value;

                this.emit('updated', prop, value);
                this.emit(prop, value);

                return true;
            }
        });
    }

    draw() {
        const data = {...this.data};
        delete data.topic;

        this.target = this.toDOM(TopicTemplate({
            scope: {
                topic: this.data.topic,
                device: this.device.data || false,
                icons: this.app.icons,
                data: data,
                fields: Object.keys(data)
            }
        }));
        this.parent.target.append(this.target);

        this.removeButton = this.target.querySelector('[data-remove-button]');
        this.removeButton.onclick = () => this.remove();
    }

    keys() {
        return Object.keys({...this.data});
    }

    update() {
        if (!this.device)
            return;

        const target = this.target.querySelector('[data-topic-device]');
        if (target.innerHTML === this.device.data.hash)
            return;

        target.innerHTML = this.device.data.hash;
    }

    remove() {
        LOG(this.label, 'REMOVE', this.data.topic);

        const postData = {
            topic: this.data.topic
        }

        return this.fetch(`${this.app.urlBase}/topic/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(response => {
            LOG(this.label, 'UPDATED:', response.data, '');

            if (response.data === true) {
                this.topics.removeTopic(this.data.topic);
            }

            return Promise.resolve(true);
        });
    }

    delete() {
        this.target.remove();
    }

    get devices() {
        return this.topics.devices;
    }

    set devices(val) {

    }

    get device() {
        const t = {...this.data}; // make a copy
        // without the topic and the value field
        delete t.topic;
        delete t.field;
        let matchDevice = false;
        this.topics.parent.devices.keys().forEach(hash => {
            const device = this.topics.parent.devices.data[hash];
            let matchA = '', matchB = '';

            Object.keys(t).forEach(key => {
                matchA += t[key];
                matchB += device.data[key];
            });

            if (`${matchA}` === `${matchB}`) {
                matchDevice = device;
            }
        });

        return matchDevice;
    }

    set device(val) {
    }
}
