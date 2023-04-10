import path from 'path';
import WebpackRun from './WebpackRun.js';
import WebpackConfigCommon from './WebpackConfigCommon.js';
import { merge } from 'webpack-merge';

export default class WebpackConfigClass {
    constructor() {
        this.getEnv();
        this.appPath = `${path.resolve(process.env.PWD)}`;
        this.common = new WebpackConfigCommon(this);
        this.runner = new WebpackRun(this);
    }

    merge() {
        this.config = merge(this.common.config, this.config);
    }

    run(){
        this.runner.run();
    }

    getEnv() {
        Object.keys(process.env).forEach(i => {
            console.log('>>> ENV:', i, process.env[i])
            global[i.toUpperCase()] = process.env[i];
        });
    }

}
