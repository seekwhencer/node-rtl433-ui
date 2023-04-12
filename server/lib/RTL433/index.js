import fs from 'fs-extra';
import path from 'path';
import {spawn} from 'child_process';
import Device from './Device.js';
import Topics from './Topics.js';
import Excludes from './Excludes.js';

export default class RTL433 extends MODULECLASS {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.debug = DEBUG || false;
            this.parent = parent;

            this.label = 'RTL433';
            LOG(this.label, 'INIT');

            this.bin = '/usr/local/bin/rtl_433';
            this.raw = '';

            this.on('device-added', device => {
                // emit initial data "change" for all data properties
                device.emitInitial();

                //APP.WEBSERVER.sendWS(JSON.stringify(device.data));
            });

            this.on('device-updated', device => {
                //console.log();
                //console.log(this.label, 'DEVICES UPDATED:', JSON.stringify(device.data));
            });

            //
            this.topics = new Topics(this);
            this.excludes = new Excludes(this);

            this.devicesSource = {};
            this.devices = new Proxy(this.devicesSource, {

                get: (target, prop, receiver) => {
                    return target[prop];
                },

                set: (target, prop, device) => {
                    if (this.excludes.contains(device))
                        return true;

                    if (device.data.model === undefined)
                        return true;

                    if (!Object.keys(this.devices).includes(prop)) { // add if not exists
                        target[prop] = device;
                        this.emit('device-added', device);
                    } else {
                        Object.keys(device.data).forEach(field => this.devices[prop].data[field] = device.data[field]);
                        this.emit('device-updated', this.devices[prop]);
                    }
                    return true;

                }
            });

            this.start();
            resolve(this);
        });
    }

    keys() {
        return Object.keys(this.devices);
    }

    start() {
        const processOptions = ['-F', 'json'];
        LOG(this.label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions));
        this.process = spawn(this.bin, processOptions);
        this.process.stdout.setEncoding('utf8');
        this.process.stdout.on('data', chunk => this.parseChunk(chunk));
    }

    parseChunk(chunk) {
        this.raw += chunk;
        const rowsRaw = this.raw.split("\n");
        rowsRaw.forEach(rowRaw => {
            let row = false;

            try {
                row = JSON.parse(rowRaw);
            } catch (e) {
                //console.log('NOT PARSED:', rowRaw);
            }

            if (row) {
                // create a new device and try to add if not exists. if exists, it will be updated
                const device = new Device(this, row);
                this.devices[device.data.hash] = device;

                // extract the parsed row from raw data
                this.raw = this.raw.replace(`${rowRaw}\n`, '');
            }
        });
    }


    reload() {
        this.topics.load();
        this.excludes.load();
    }

    addTopic(data) {
        return this.topics.add(data);
    }

    removeTopic(topic) {
        return this.topics.remove(topic);
    }

    getTopics() {
        this.keys().forEach(hash => this.devices[hash].getTopics());
    }

    addExclude(data) {
        return this.excludes.add(data).then(ok => {
            this.removeExcluded();
            return Promise.resolve(ok);
        });
    }

    removeExcluded() {
        this.keys().forEach(hash => this.devices[hash].checkExcluded());
    }

    removeDevice(device) {
        LOG(this.label, 'DELETED', device.data.model, device.data.hash);
        delete this.devices[device.data.hash];
    }

    removeExclude(data) {
        return this.excludes.remove(data);
    }
}