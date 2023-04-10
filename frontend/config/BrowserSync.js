import path from "path";
import browserSync from "browser-sync";
import {createProxyMiddleware} from "http-proxy-middleware";
import {responseInterceptor} from "http-proxy-middleware";

export default class {
    constructor(parent) {
        this.parent = parent;
        this.proxyMiddleware = createProxyMiddleware;
        this.responseInterceptor = responseInterceptor;

        this.port = parseInt(SERVER_PORT) || 4000;
        this.proxyTargetHost = PROXY_TARGET_HOST || 'localhost';
        this.proxyTargetPort = PROXY_TARGET_PORT || 3000;
        this.proxyTarget = `http://${this.proxyTargetHost}${this.proxyTargetPort === 80 ? null : `:${this.proxyTargetPort}`}`;
        this.bundePath = path.resolve(`${process.cwd()}/dist/dev`);

        console.log('');
        console.log('>>>', this.proxyTarget);
        console.log('>>> BUNDLE PATH:', this.bundePath);
        console.log('');

        this.engine = browserSync.create();

        this.proxy = this.proxyMiddleware({
            target: this.proxyTarget,
            changeOrigin: true,
            secure: false,
            rejectUnauthorized: false
        });

        this.engine.init({
            watch: true,
            cwd: `${this.bundePath}/css/`,
            injectChanges: true,
            files: ["*.css"],
            port: this.port,
            open: false,
            reloadDebounce: 50,
            server: {
                middleware: [this.proxy]
            }
        });
    }
}
