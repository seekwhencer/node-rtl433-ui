import bodyParser from 'body-parser';

export default class Route extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.router = EXPRESS.Router();

        this.jsonParser = bodyParser.json();
        this.urlencodedParser = bodyParser.urlencoded({ extended: false });
    }

    nicePath(path) {
        return decodeURI(path).replace(/^\//, '').replace(/\/$/, '');
    }

    extractPath(path, subtract) {
        return this.nicePath(path).replace(new RegExp(`${subtract}`, ''), '').split('/');
    }
}
