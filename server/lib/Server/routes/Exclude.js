import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.post('/exclude/remove', this.jsonParser);
        this.router.post('/exclude/remove', (req, res) => {
            const params = req.body;

            APP.RTL433.removeExclude(params).then(data => {
                res.json({
                    message: 'remve exclude',
                    data: data
                });
            });
        });

        return this.router;
    }
}
