import fs from 'fs-extra';
import path from 'path';

export default class RTL433Topics extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.parent = parent;

        this.label = 'RTL433 TOPICS';
        LOG(this.label, 'INIT');

        this.topicsMappingFile = path.resolve('../rtl_433/mapping.json');
        this.data = [];

        this.load();
    }

    load() {
        LOG(this.label, 'LOAD', this.topicsMappingFile);
        return fs.readFile(this.topicsMappingFile, (err, data) => this.data = JSON.parse(data.toString()));
    }

    write() {
        LOG(this.label, 'WRITE', this.topicsMappingFile);
        return fs.writeFile(this.topicsMappingFile, JSON.stringify(this.data), (err, data) => {
        });
    }

    add(data) {
        return new Promise((resolve, reject) => {
            if (`${data.topic}`.trim() === '') {
                resolve(false);
                return;
            }

            const exists = this.data.filter(t => t.topic === data.topic)[0] || false;
            if (exists) {
                resolve(false);
                return;
            }

            const newTopic = {
                topic: data.topic,
                hash: data.hash,
                field: data.field
            };

            this.data.push(newTopic);
            this.write();

            this.parent.devices[data.hash].getTopics();
            resolve(true);
        });
    }

    remove(topic){
        return new Promise((resolve, reject) => {
            if (`${topic}`.trim() === '') {
                resolve(false);
                return;
            }
            const exists = this.data.filter(t => t.topic === topic)[0] || false;
            if (!exists) {
                resolve(false);
                return;
            }
            this.data = this.data.filter(t => t.topic !== topic);

            // @TODO async
            this.write();
            this.load();

            this.parent.getTopics();

            resolve(true);
        });
    }
}