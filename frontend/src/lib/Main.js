import './Global/Globals.js';

import Locale from './Locale/index.js';
import * as Icons from './Icons/index.js';

import Navigation from './Navigation/index.js';

// tabs
import Home from './Home/index.js';
import Setup from './Setup/index.js';

export default class Main extends MODULECLASS {
    constructor(options) {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'APP';
            LOG(this.label, 'INIT');

            this.app = this;
            this.options = options;

            this.icons = Icons;

            this.mediaBaseUrl = `${window.location.origin}/media`;
            this.apiBaseUrl = `${window.location.origin}/api`;
            this.wsBaseUrl = `${window.location.host}/live`;
            this.urlBase = `${this.apiBaseUrl}`;

            this.rootElement = this.options.target;
            this.target = this.rootElement;

            LOG(this.label, 'API BASE URL:', this.urlBase);

            // this class
            this.on('ready', () => {
                this.showTab('home');
                resolve(this)
            });

            // on a tab change
            this.on('tab', tab => {
                // display a tab
                this.showTab(tab);

                // dummy
                this.emit(`tab-${tab}`);
            });

            // things
            this.locale = new Locale(this);
            this.navigation = new Navigation(this);

            // tabs
            this.tabs = {
                home: new Home(this)
            }

            this.ws = new WebSocket(`ws://${this.wsBaseUrl}`);

            this.ws.onopen = (e) => {
                this.ws.send("My name is John");
            };

            this.ws.onmessage = (event) => {
                LOG(`[message] Data received from server: ${event.data}`);
            };

            this.ws.onclose = (event) => {
                if (event.wasClean) {
                    LOG(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                    // e.g. server process killed or network down
                    // event.code is usually 1006 in this case
                    LOG('[close] Connection died');
                }
            };

            this.ws.onerror = (error) => {
                LOG(`[error]`);
            };

            // finally ;)
            this.emit('ready');

        });
    }

    showTab(tab) {
        this.tabs[tab].show();
    }

}



