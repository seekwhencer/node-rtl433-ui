import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/topics', (req, res) => {
            const topics = APP.RTL433.topicsMapping;
            res.json({
                message: 'all topics',
                data: topics
            });
        });

        return this.router;
    }
}
