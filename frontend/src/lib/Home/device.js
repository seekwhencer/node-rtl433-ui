import DeviceTemplate from './Templates/Device.html';
import DeviceTopicsTemplate from './Templates/DeviceTopics.html';

export default class Device extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.parent = parent;
        this.label = 'DEVICE';

        this.dataSource = options;
        this.data = new Proxy(this.dataSource, {
            get: (target, prop, receiver) => {
                return target[prop] || this.dataSource[prop];
            },
            set: (target, prop, value) => {
                if (JSON.stringify(target[prop]) === JSON.stringify(value))
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
        delete data.topics;
        delete data.protocol;
        delete data.id;
        delete data.channel;
        delete data.model;

        this.target = this.toDOM(DeviceTemplate({
            scope: {
                model: this.data.model,
                id: this.data.id,
                channel: this.data.channel,
                protocol: this.data.protocol,
                icons: this.app.icons,
                data: data,
                topics: this.topics || [],
                fields: Object.keys(data)
            }
        }));
        this.parent.target.append(this.target);
        this.target.onclick = () => this.select();

        this.target.querySelectorAll('[data-device-property-button]').forEach(button => button.onclick = () => this.selectProperty(button));
        this.target.querySelector('[data-device-exclude-button]').onclick = () => this.excludeDevice();
        this.target.querySelector('[data-model-exclude-button]').onclick = () => this.excludeModel();

        this.removeListener('updated', this.onPropUpdate);
        this.on('updated', (prop, value) => this.onPropUpdate(prop, value));

        this.removeListener('topics', this.onTopicsUpdate);
        this.on('topics', () => this.onTopicsUpdate());

        this.drawTopics();
    }

    drawTopics() {
        const data = {...this.data};
        delete data.topics;

        // the topics element
        this.topicsTarget = this.target.querySelector('[data-device-topics]');
        this.topicsTarget.classList.add('updated');
        this.topicsElement = this.toDOM(DeviceTopicsTemplate({
            scope: {
                icons: this.app.icons,
                data: data,
                topics: this.topics || [],
                fields: Object.keys(data)
            }
        }));
        this.topicsTarget.replaceChildren(this.topicsElement);
        setTimeout(() => this.topicsTarget.classList.remove('updated'), 2000);

        // register a listener on topic field changes
        // this is the magic !!!
        // the event invoked by the proxy setter by emitting the topic field
        this.topics.forEach(topic => this.removeListener(topic.data.field, this.onTopicUpdate));
        this.topics.forEach(topic => this.on(topic.data.field, value => this.onTopicUpdate(topic, value)));

        // set the device as active
        this.topics.length > 0 ? this.target.classList.add('active') : this.target.classList.remove('active');

    }

    update(deviceData) {
        Object.keys(deviceData).forEach(d => this.data[d] = deviceData[d]);
    }

    selectProperty(button) {
        const field = button.dataset.devicePropertyButton;
        LOG(this.label, 'SELECT PROPERTY', field);
        this.parent.parent.topics.addTopic(this.data.hash, field);

    }

    select() {

    }

    excludeDevice() {
        this.exclude({
            hash: this.data.hash
        });
    }

    excludeModel() {
        this.exclude({
            model: this.data.model
        });
    }

    exclude(data) {
        LOG(this.label, 'EXCLUDE DEVICE', data, this.data.hash, this.data.model);
        return this.fetch(`${this.app.urlBase}/device/exclude`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            LOG(this.label, 'EXCLUDED:', response.data, '');

            if (response.data === true) {
                /// @TODO remove device from list
            }

            return Promise.resolve(true);
        });
    }

    onPropUpdate(prop, value) {
        const target = this.target.querySelector(`[data-device-property=${prop}]`);

        if (!target)
            return;

        target.classList.add('updated');
        target.innerHTML = value;
        setTimeout(() => target.classList.remove('updated'), 2000);
    }

    onTopicUpdate(topic, value) {
        const target = this.target.querySelector(`[data-topic-value=${topic.data.field}]`);
        target.classList.add('updated');
        target.innerHTML = value;
        setTimeout(() => target.classList.remove('updated'), 2000);
    }

    onTopicsUpdate() {
        LOG(this.label, this.data.id, 'TOPICS CHANGED');
        this.drawTopics();
    }

    get topics() {
        const topics = [];
        const availableTopics = this.parent.parent.topics.data;

        Object.keys(availableTopics).forEach(topicKey => {
            const topicData = availableTopics[topicKey].data;
            const t = {...topicData};
            delete t.field;
            delete t.topic;

            let matchA = '', matchB = '';

            Object.keys(t).forEach(key => {
                matchA += t[key];
                matchB += this.data[key];
            });

            if (`${matchA}` === `${matchB}`) {
                topics.push(availableTopics[topicKey]);
            }

        });

        return topics;
    }

// not used
    set topics(val) {
    }


}
