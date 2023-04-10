export default class Tab extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.on('draw', () => {
            this.target.classList.add('active');
        });
    }

    show() {
        LOG(this.label, 'SHOW TAB', this.tab);
        this.app.navigation.select(this.tab);

        this.hideAll();
        this.target.classList.add('active');
    }

    hideAll() {
        // hide all tabs
        Object.keys(this.app.tabs).forEach(tab => {
            tab !== this.tab ? this.app.tabs[tab].hide() : null;
        });
    }

    hide() {
        this.target.classList.remove('active');
    }
}
