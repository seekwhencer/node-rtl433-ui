import Topic from "./topic.js";
import TopicAddTemplate from './Templates/TopicAdd.html';


export default class Topics extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'TOPICS';
        this.parent = parent;

        this.target = this.parent.target.querySelector('[data-topics]');
        this.target.innerHTML = '';

        this.targetAddTopic = this.parent.target.querySelector('[data-topic-add]');

        this.dataSource = {};
        this.data = new Proxy(this.dataSource, {
            get: (target, prop, receiver) => {
                return target[prop] || this.dataSource[prop];
            },
            set: (target, prop, topic) => {
                // add or update
                if (!target[prop]) {
                    target[prop] = topic;
                    topic.draw();
                } else {
                    Object.keys(topic.data).forEach(d => this.data[prop].data[d] = topic.data[d]);
                }
                return true;

            }
        });
        this.getAll();
    }

    getAll() {
        return this.fetch(`${this.app.urlBase}/topics`).then(raw => {
            this.raw = raw.data;
            this.raw.forEach(topicsData => {
                const topic = new Topic(this, topicsData);
                this.data[topic.data.topic] = topic;
            });
            this.emit('complete');
            return Promise.resolve(true);
        });
    }

    keys() {
        return Object.keys({...this.data});
    }

    update() {
        this.keys().forEach(topic => this.data[topic].update());
    }

    //@TODO
    addTopic(deviceHash, field) {
        LOG(this.label, 'ADD TOPIC', deviceHash, field);

        const topicData = {
            field: field,
            model: this.devices.data[deviceHash].data.model,
            hash: deviceHash
        };

        const targetAddTopic = this.toDOM(TopicAddTemplate({
            scope: topicData
        }));
        this.targetAddTopic.replaceChildren(targetAddTopic);

        const addTopicButton = this.targetAddTopic.querySelector('[data-add-button]');
        addTopicButton.onclick = () => this.submitAddTopic(topicData);
    }

    removeTopic(topic) {
        this.data[topic].delete();
        delete this.data[topic];
        this.getAll().then(() => {
            this.devices.keys().forEach(hash => this.devices.data[hash].drawTopics());
        });

    }

    submitAddTopic(data) {
        const topic = this.targetAddTopic.querySelector('input').value;
        LOG(this.label, 'ADD TOPIC', topic, data);

        const postData = {
            topic: topic,
            hash: data.hash,
            field: data.field
        }

        return this.fetch(`${this.app.urlBase}/topic/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(response => {
            LOG(this.label, 'UPDATED:', response.data, '');

            if (response.data === true) {
                this.getAll().then(() => {
                    this.devices.keys().forEach(hash => this.devices.data[hash].drawTopics());
                    this.targetAddTopic.innerHTML = '';
                });
            }

            return Promise.resolve(true);
        });
    }

    show() {
        this.target.classList.add('active');
        this.targetAddTopic.classList.add('active');
    }

    hide() {
        this.target.classList.remove('active');
        this.targetAddTopic.classList.remove('active');
    }

    get devices() {
        return this.parent.devices;
    }

    set devices(val) {
    }
}
