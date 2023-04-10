import './lib/Globals.js';
import Config from '../shared/lib/Config.js';
import WebServer from './lib/Server/index.js';
import Mqtt from './lib/Mqtt/index.js';
import RTL433 from './lib/RTL433/index.js'

export default class App extends MODULECLASS {
    constructor() {
        super();

        global.APP = this;

        return new Config(this)
            .then(config => {
                global.CONF = config;
                global.CONFIG = config.configData;
                return new WebServer(this);
            })
            .then(webserver => {
                global.APP.WEBSERVER = webserver;
                return new Mqtt(this);
            })
            .then(mqtt => {
                global.APP.MQTT = mqtt;
                return new RTL433(this);
            })
            .then(rtl433 => {
                global.APP.RTL433 = rtl433;
                return Promise.resolve(this);
            });
    }
}