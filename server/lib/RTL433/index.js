import fs from 'fs-extra';
import path from 'path';
import {spawn} from 'child_process';
import Device from './Device.js';

export default class RTL433 extends MODULECLASS {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.debug = DEBUG || false;
            this.parent = parent;

            this.label = 'RTL433';
            LOG(this.label, 'INIT');

            this.excludesFile = path.resolve('../rtl_433/excludes.json');
            this.topicsMappingFile = path.resolve('../rtl_433/mapping.json');
            this.loadTopics();
            this.loadExcludes();

            this.bin = '/usr/local/bin/rtl_433';
            this.tty = false;
            this.data = [];
            this.raw = '';

            this.on('device-added', device => {
                // emit initial data "change" for all data properties
                device.emitIntital();

                //APP.WEBSERVER.sendWS(JSON.stringify(device.data));
            });

            this.on('device-updated', device => {
                //console.log();
                //console.log(this.label, 'DEVICES UPDATED:', JSON.stringify(device.data));
            });

            this.devicesSource = {};
            this.devices = new Proxy(this.devicesSource, {

                get: (target, prop, receiver) => {
                    return target[prop];
                },

                set: (target, prop, device) => {
                    if (this.excludes.includes(device.data.model)) //@TODO
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

    loadTopics() {
        fs.readFile(this.topicsMappingFile, (err, data) => this.topicsMapping = JSON.parse(data.toString()));
    }

    loadExcludes() {
        fs.readFile(this.excludesFile, (err, data) => this.excludes = JSON.parse(data.toString()));
    }

    writeTopics() {
        fs.writeFile(this.topicsMappingFile, JSON.stringify(this.topicsMapping), (err, data) => {
        });
    }

    reload() {
        this.loadTopics();
        this.loadExcludes();
    }

    addTopic(data) {
        return new Promise((resolve, reject) => {
            if (`${data.topic}`.trim() === '') {
                resolve(false);
                return;
            }

            const exists = this.topicsMapping.filter(t => t.topic === data.topic)[0] || false;
            LOG(this.label, '>>>>', exists, '');

            if (exists) {
                resolve(false);
                return;
            }

            const newTopic = {
                topic: data.topic,
                hash: data.hash,
                field: data.field
            };

            this.topicsMapping.push(newTopic);
            this.writeTopics();

            this.devices[data.hash].getTopics();


            resolve(true);
        });

    }

    removeTopic(topic) {
        return new Promise((resolve, reject) => {
            if (`${topic}`.trim() === '') {
                resolve(false);
                return;
            }
            const exists = this.topicsMapping.filter(t => t.topic === topic)[0] || false;
            if (!exists) {
                resolve(false);
                return;
            }
            this.topicsMapping = this.topicsMapping.filter(t => t.topic !== topic);
            this.writeTopics();
            this.loadTopics();

            this.getTopics();

            resolve(true);
        });
    }

    getTopics() {
        this.keys().forEach(hash => {
            this.devices[hash].getTopics();
        });
    }

    excludeDevice(data) {
        return new Promise((resolve, reject) => {
            LOG(this.label, 'EXCLUDE DEVICE', data, '');

            // @TODO add to exclude list
            // @TODO remove device or devices from list

            resolve(true);
        });
    }
}