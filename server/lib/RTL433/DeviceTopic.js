export default class RTL433DeviceTopic extends MODULECLASS {
    constructor(parent, topicData) {
        super(parent);
        this.label = 'RTL433 DEVICE TOPIC';
        this.device = parent;

        this.dataSource = topicData;
        this.data = new Proxy(this.dataSource, {
            get: (target, prop, receiver) => {
                return target[prop] || this.dataSource[prop];
            },
            set: (target, prop, value) => {
                target[prop] = value;
                return true;
            }
        });

        this.device.on(this.data.field, value => this.onProperty(value));
    }

    onProperty(value) {
        LOG(this.label, 'GOT', value, this.data.field, this.data.topic, JSON.stringify(this.device.data));
        this.publish(value);

        /*APP.WEBSERVER.sendWS(JSON.stringify({
            hash: this.device.data.hash,
            topic: this.data.topic,
            field: this.data.field,
            value: value
        }));*/
    }

    publish(value) {
        APP.MQTT.publish(this.data.topic, `${value}`);
    }
}