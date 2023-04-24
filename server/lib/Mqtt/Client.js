import * as mqtt from "mqtt"

export default class MqttClient extends MODULECLASS {
    constructor(parent) {
        super(parent);

        return new Promise((resolve, reject) => {
            this.label = 'MQTT CLIENT'
            this.url = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;
            LOG(this.label, 'INIT ON', this.url, 'AS', `${MQTT_CLIENT_ID}`);

            this.parent = parent;

            this.options = {
                connection: {
                    clientId: `${MQTT_CLIENT_ID}`,
                    reconnectPeriod: 1000,
                    connectTimeout: 30 * 1000
                    //...
                }
            }

            // events
            this.on('connect', () => {
                this.publish('app', 'welcome');
                LOG(this.label, 'CONNECTED TO:', this.url, 'AS', `${MQTT_CLIENT_ID}`);
                resolve(this);
            });

            this.on('error', error => {
                LOG(this.label, 'ERROR', this.url, 'AS', `${MQTT_CLIENT_ID}`);
                ERROR(this.label, error, '');
            });

            this.on('message', (topic, buffer) => {
                this.message(topic, buffer);
            });

            // connect finally
            this.connect();
        });
    }

    connect() {
        // connecting
        this.connection = mqtt.connect(this.url, this.options.connection);

        // add events
        this.connection.on('connect', () => this.emit('connect'));
        this.connection.on('reconnect', () => this.emit('reconnect'));
        this.connection.on('close', () => this.emit('close'));
        this.connection.on('disconnect', (packet) => this.emit('disconnect', packet));
        this.connection.on('offline', () => this.emit('offline'));
        this.connection.on('error', (error) => this.emit('error', error));
        this.connection.on('message', (topic, buffer) => this.emit('message', topic, buffer));

        // subscribe all topics
        // this.subscribe('#');
    }

    subscribe(topic) {
        this.connection.subscribe(topic, err => this.error(err));
    }

    publish(topic, data) {
        this.connection.publish(topic, data);
    }

    message(topic, buffer) {
        LOG(this.label, topic.toString(), buffer.toString());
    }

    disconnect() {
        this.connection.end();
    }

    reconnect() {
        this.connection.reconnect();
    }

    error(err) {
        if (err) {
            LOG(this.label, err);
        }
    }

}