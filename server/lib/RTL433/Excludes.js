import fs from 'fs-extra';
import path from 'path';

export default class RTL433Excludes extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.parent = parent;

        this.label = 'RTL433 EXCLUDES';
        LOG(this.label, 'INIT');

        this.excludesFile = path.resolve(`${CONF.path}/excludes.json`);
        this.data = [];

        this.load();
    }

    load() {
        LOG(this.label, 'LOAD', this.excludesFile);
        return fs.readFile(this.excludesFile, (err, data) => this.data = JSON.parse(data.toString()));
    }

    write() {
        LOG(this.label, 'WRITE', this.excludesFile);
        return fs.writeFile(this.excludesFile, JSON.stringify(this.data), (err, data) => {
        });
    }

    add(data) {
        return new Promise((resolve, reject) => {
            if (data.model)
                if (this.models.includes(data.model)) {
                    resolve(false);
                    return;
                }

            if (data.hash)
                if (this.hashes.includes(data.hash)) {
                    resolve(false);
                    return;
                }

            const newExclude = {
                model: data.model,
                hash: data.hash
            }
            this.data.push(newExclude);
            this.write();

            resolve(true);
        });
    }

    remove(data) {
        return new Promise((resolve, reject) => {
            LOG(this.label, 'REMOVE', data, '');

            this.data = this.data.filter(ex => ex[data.field] !== data.value);
            this.write();

            resolve(true);
        });
    }

    contains(device) {
        return this.models.includes(device.data.model) || this.hashes.includes(device.data.hash);
    }

    get models() {
        return this.data.map(ex => ex.model) || [];
    }

    set models(val) {
        // nothing
    }

    get hashes() {
        return this.data.map(ex => ex.hash) || [];
    }

    set hashes(val) {
        // nothing
    }
}