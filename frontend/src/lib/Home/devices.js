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
        if (!this.parent.parent.navigation.refresh) {
            return Promise.resolve(false);
        }

        return this.fetch(`${this.app.urlBase}/devices`).then(raw => {
            this.raw = raw.data;
            this.raw.forEach(deviceData => this.addDevice(deviceData));

            //@TODO check if some devices where dropped
            this.checkRemoved();

            this.order(this.parent.parent.navigation.orderBy || 'time');
            this.emit('complete');
            return Promise.resolve(true);
        });
    }

    addDevice(deviceData) {
        const device = new Device(this, deviceData);
        this.data[device.data.hash] = device;
    }

    order(by) {
        const orderValues = Object.keys(this.data).map(hash => `A${this.data[hash].data[by].toString().padStart('100','0')}__${this.data[hash].data.hash}`);

        //LOG(this.label, 'ORDER', by, 'VALUES', orderValues);
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
        return Object.keys(this.data);
    }

    checkRemoved() {
        this.keys().forEach(hash => this.data[hash].checkRemoved());
    }

    removeDevice(device) {
        delete this.data[device.data.hash];
    }

    get models() {
        return this.data.map(device => device.data.model);
    }

    set models(val) {
        // nothing
    }

}
