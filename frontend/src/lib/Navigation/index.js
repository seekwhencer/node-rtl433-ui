import NavigationTemplate from './Templates/navigation.html';

export default class Navigation extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'NAVIGATION';
        LOG(this.label, 'INIT');

        this.target = this.toDOM(NavigationTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        this.refreshSwitch = this.target.querySelector('[data-navigation-refresh]');
        this.refreshSwitch.onclick = () => this.toggleRefresh();

        this.refresh = true;
    }

    toggleRefresh() {
        this.refresh ? this.refresh = false : this.refresh = true;
        LOG(this.label, 'TOGGLE REFRESH', this.refresh);
    }

    get refresh() {
        return this._refresh;
    }

    set refresh(val) {
        this._refresh = val;
        this.refresh ? this.refreshSwitch.classList.add('active') : this.refreshSwitch.classList.remove('active');
    }
}
