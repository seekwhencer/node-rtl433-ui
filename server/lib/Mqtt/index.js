import MqttClient from './Client.js';

export default class Mqtt extends MODULECLASS {
    constructor(parent) {
        super(parent);

        return new Promise((resolve, reject) => {
            this.label = 'MQTT'
            LOG(this.label, 'INIT');
            this.parent = parent;

            new MqttClient(this)
                .then(client => {
                    this.client = client;
                    resolve(this);
                });
        });
    }

    publish(topic, data) {
        this.client.publish(topic, data);
    }

    subscribe(topic) {
        this.client.subscribe(topic, err => this.error(err));
    }
}