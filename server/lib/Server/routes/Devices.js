import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/devices', (req, res) => {
            const devices = Object.keys(APP.RTL433.devices).map(hash => {
                return {
                    ...APP.RTL433.devices[hash].data,
                    topics: APP.RTL433.devices[hash].topics.map(t => {
                        return {
                            topic: t.data.topic,
                            field: t.data.field
                        }
                    })
                };
            });
            res.json({
                message: 'all devices',
                data: devices
            });
        });

        this.router.get('/devices/reload', (req, res) => {
            APP.RTL433.reload();

            res.json({
                message: 'reload',
                data: {}
            });
        });

        this.router.get('/devices/forget', (req, res) => {
            APP.RTL433.toggleForget();

            res.json({
                message: 'reload',
                data: APP.RTL433.forget
            });
        });

        return this.router;
    }
}
