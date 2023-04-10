import Device from './device.js';

export default class Devices extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'DEVICES';

        this.target = this.parent.target.querySelector('[data-devices]');

        this.dataSource = {};
        this.data = new Proxy(this.dataSource, {
            get: (target, prop, receiver) => {
                return target[prop] || this.dataSource[prop];
            },
            set: (target, prop, device) => {
                // add or update
                if (!target[prop]) {
                    target[prop] = device;
                    target[prop].draw();
                } else {
                    //Object.keys(device.data).forEach(d => this.data[prop].data[d] = device.data[d]);
                    this.data[prop].update(device.data);
                }
                return true;

            }
        });

    }

    startInterval() {
        if (this.interval)
            clearInterval(this.interval);

        this.interval = setInterval(() => this.getAll(), 1000);
    }

    getAll() {
        return this.fetch(`${this.app.urlBase}/devices`).then(raw => {
            this.raw = raw.data;
            this.raw.forEach(deviceData => this.addDevice(deviceData));
            this.order('time');
            this.emit('complete');
            return Promise.resolve(true);
        });
    }

    addDevice(deviceData) {
        const device = new Device(this, deviceData);
        this.data[device.data.hash] = device;
    }

    order(by) {
        const orderValues = Object.keys(this.data).map(hash => `${this.data[hash].data[by]}__${this.data[hash].data.hash}`);
        orderValues.sort();
        orderValues.reverse();

        let i = 0;
        orderValues.forEach(value => {
            const hash = value.split('__')[1];
            const device = this.data[hash];
            device.target.style.order = i;
            i++;
        });
    }

    keys() {
        return Object.keys({...this.data});
    }

}
