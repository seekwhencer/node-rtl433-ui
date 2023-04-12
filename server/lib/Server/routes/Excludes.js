import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/excludes', (req, res) => {
            const topics = APP.RTL433.excludes.data;
            res.json({
                message: 'all excludes',
                data: topics
            });
        });

        return this.router;
    }
}
