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

        this.sideSwitch = this.target.querySelector('[data-navigation-side]');
        this.sideSwitch.onclick = () => this.toggleSide();

        this.refresh = true;
    }

    toggleRefresh() {
        this.refresh ? this.refresh = false : this.refresh = true;
        LOG(this.label, 'TOGGLE REFRESH', this.refresh);
    }

    toggleSide() {
        this.side ? this.side = false : this.side = true;
        LOG(this.label, 'TOGGLE SIDE', this.side);

        if (!this.side) {
            this.parent.tabs.home.topics.show();
            this.parent.tabs.home.excludes.hide();
        } else {
            this.parent.tabs.home.topics.hide();
            this.parent.tabs.home.excludes.show();
        }
    }

    get refresh() {
        return this._refresh;
    }

    set refresh(val) {
        this._refresh = val;
        this.refresh ? this.refreshSwitch.classList.add('active') : this.refreshSwitch.classList.remove('active');
    }


    get side() {
        return this._side;
    }

    set side(val) {
        this._side = val;
        this.side ? this.sideSwitch.classList.add('active') : this.sideSwitch.classList.remove('active');
    }


}
