import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/', (req, res) => {
            res.json({
                home: "test"
            });
        });

        return this.router;
    }
}
