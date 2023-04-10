import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.post('/topic/add', this.jsonParser);
        this.router.post('/topic/add', (req, res) => {
            const params = req.body;

            APP.RTL433.addTopic(params).then(data => {
                res.json({
                    message: 'add topic',
                    data: data
                });
            });

        });

        return this.router;
    }
}
