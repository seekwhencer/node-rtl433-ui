import webpack from "webpack";
import BrowserSync from "./BrowserSync.js";
import fs from "fs-extra";

export default class WebpackRun {
    constructor(parent) {
        this.parent = parent;
        this.bundler = false;
        this.server = false;
    }

    run() {
        this.config = this.parent.config;
        this.parent.config.mode === 'development' ? this.runDev() : this.runProd();
    }

    runDev() {
        //this.port = this.config.devServer.port;
        //this.host = this.config.devServer.host;

        /*this.server = new WebpackDevServer(this.config.devServer, webpack(this.config));
        this.server.listen(this.port, this.host, err => {
            err ? console.log(err) : null;
            console.log('WebpackDevServer listening at:', this.port, ':', this.host);
        });*/

        this.browserSync = new BrowserSync(this);

        this.bundler = webpack(this.config);

        const watching = this.bundler.watch(this.config.watchOptions, (err, stats) => {
            console.log(stats.hash, stats.fullHash);
        });

//        this.runProd();

    }

    runProd() {
        this.bundler = webpack(this.config, (err, stats) => {
            if (err || stats.hasErrors()) {
                console.log('>>> ERROR: ', err, stats);
            } else {
                console.log('>>> BUNDLING COMPLETE');
                this.rewriteHTML(/hash/g, parseInt(new Date().getTime() / 1000));
            }
        });
    }

    rewriteHTML(from, to) {
        console.log('>>> REWRITE HTML');
        const indexHTMLFile = `${this.parent.appPath}/dist/prod/index.html`;
        fs.readFile(indexHTMLFile, (err, data) => {
            const reData = data.toString().replace(from, to);
            fs.writeFile(indexHTMLFile, reData, err => {
            });
        });
    }
}
