import Events from './Events.js';
import Crypto from 'crypto';
import {spawn} from 'child_process';

export default class Module extends Events {
    constructor(parent, options) {
        super();
        this.items = [];
        parent ? this.parent = parent : null;
        this.parent ? this.parent.app ? this.app = this.parent.app : null : null;
        this.id = `${Crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`; // @TODO random hash
    }

    /**
     * get one, the first item by:
     *
     * @param match
     * @param field
     * @param not
     * @returns {*}
     */
    one(match, field, not) {
        return this.get(match, field, not)[0];
    }

    /**
     * get many items by:
     *
     * @param match
     * @param field
     * @param not
     * @returns {*[]}
     */
    many(match, field, not) {
        return this.get(match, field, not);
    }

    /**
     * get some items by:
     *
     * @param match
     * @param field
     * @param not
     * @returns {*[]}
     */
    get(match, field, not) {
        !field ? field = 'id' : null;
        return this.items.filter(item => {
            if (item['field'] === match) {
                return not !== item['field'];
            }
        });
    }

    /**
     *
     * @param bin
     * @param params
     * @returns {Promise<any>}
     */
    command(bin, params) {
        return new Promise((resolve, reject) => {
            LOG('MODULE COMMAND()', bin, JSON.stringify(params));
            let data = '';
            const process = spawn(bin, params);
            process.stdout.on('data', chunk => data += chunk);
            process.stdout.on('end', () => resolve(data));
        });
    }
}
