import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import expressWs from 'express-ws';
import * as Routes from './routes/index.js';

export default class WebServer extends MODULECLASS {
    constructor(parent) {
        super(parent);

        return new Promise((resolve, reject) => {
            this.label = 'WEBSERVER';
            LOG(this.label, 'INIT');

            this.parent = parent;
            this.port = SERVER_PORT || 3000;

            // the websocket connections (not in use)
            this.wsConnections = [];

            NODE_ENV === 'production' ? this.env = 'prod' : this.env = 'dev';

            // set the frontend statics source path
            this.documentRoot = path.resolve(`${APP_DIR}/${SERVER_FRONTEND_PATH}`);

            // set express globally
            global.EXPRESS = express;

            this.create().then(() => resolve(this));

        });
    }

    create() {
        this.engine = EXPRESS();
        this.ws = expressWs(this.engine);

        // websocket connection
        this.engine.ws('/live', (ws, req) => {

            this.wsConnections.push(ws);

            ws.on('message', msg => {
                LOG(this.label, 'WEBSOCKET MESSAGE INCOME', msg);
                //ws.send(msg);
            });
        });

        // statics
        LOG(this.label, 'STATICS FOLDER', this.documentRoot);
        this.engine.use(express.static(this.documentRoot));


        // favicon
        this.engine.get('/favicon.ico', (req, res) => {
            if (fs.existsSync(icon)) {
                res.setHeader('Content-Type', 'application/json');
                res.sendFile(icon);
            } else {
                res.end();
            }
        });

        // the routes
        Object.keys(Routes).forEach(route => this.engine.use(`/api/`, new Routes[route](this)));

        // start
        return new Promise((resolve, reject) => {
            this.engine.listen(this.port, () => {
                LOG(this.label, 'IS LISTENING ON PORT:', this.port);
                resolve();
            });
        });

    }

    sendWS(msg) {
        this.wsConnections.forEach(ws => ws.send(msg));
    }
}