import ExcludeTemplate from './Templates/Exclude.html';

export default class Excludes extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'EXCLUDES';
        this.parent = parent;

        this.target = this.parent.target.querySelector('[data-excludes]');
        this.target.innerHTML = '';

        this.data = [];
        this.getAll();
    }

    getAll() {
        return this.fetch(`${this.app.urlBase}/excludes`).then(raw => {
            this.data = raw.data;
            this.draw();
            this.emit('complete');
            return Promise.resolve(true);
        });
    }

    draw() {
        this.target.innerHTML = '';
        this.data.forEach(exclude => {
            const data = {};
            exclude.model ? data.field = 'model' : null;
            exclude.hash ? data.field = 'hash' : null;
            data.value = exclude.model || exclude.hash;

            const element = toDOM(ExcludeTemplate({
                    scope: data
                }
            ));
            element.querySelector('[data-remove-button]').onclick = () => this.removeExclude(data);
            this.target.append(element);
        });
    }

    removeExclude(data) {
        LOG(this.label, 'REMOVE', data);

        return this.fetch(`${this.app.urlBase}/exclude/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            LOG(this.label, 'UPDATED:', response.data, '');

            if (response.data === true) {
                this.getAll();
            }

            return Promise.resolve(true);
        });
    }

    show() {
        this.target.classList.add('active');
    }

    hide() {
        this.target.classList.remove('active');
    }

}
