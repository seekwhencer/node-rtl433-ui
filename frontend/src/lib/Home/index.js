import Tab from '../Tab.js';
import LayoutTemplate from "./Templates/layout.html";
import Devices from './devices.js';
import Topics from './topics.js';
import Excludes from './excludes.js';

export default class Home extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'HOME'
        this.tab = 'home';

        this.target = this.toDOM(LayoutTemplate({
            scope: {
                icons: this.app.icons
            }
        }));
        this.parent.target.append(this.target);

        this.topics = new Topics(this);
        this.devices = new Devices(this);
        this.excludes = new Excludes(this);

        this.topics.on('complete', () => this.devices.startInterval());
        this.devices.on('complete', () => this.topics.update());
    }

    show() {
        super.show();
    }
}
