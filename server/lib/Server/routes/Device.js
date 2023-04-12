import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.post('/device/exclude', this.jsonParser);
        this.router.post('/device/exclude', (req, res) => {
            const params = req.body;

            APP.RTL433.addExclude(params).then(data => {
                res.json({
                    message: 'exclude device',
                    data: data
                });
            });
        });


        return this.router;
    }
}
