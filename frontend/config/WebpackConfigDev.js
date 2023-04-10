import path from 'path';
import WebpackConfigClass from './WebpackConfigClass.js';
import StyleLintPlugin from "stylelint-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";


class WebpackDev extends WebpackConfigClass {
    constructor(options) {
        super();

        this.options = options | {silent: false}
        this.proxyTargetHost = PROXY_TARGET_HOST || 'localhost';
        this.proxyTargetPort = PROXY_TARGET_PORT || '3000';

        this.build();
        this.merge();

        !this.options.silent ? this.run() : false;
    }

    build() {
        this.config = {
            entry: {
                app: ['./src/app.js', './src/scss/app.scss']
            },

            target: 'web',
            mode: 'development',

            devtool: 'eval-source-map',

            output: {
                path: `${this.appPath}/dist/dev`,
                filename: './js/[name].js',
                hotUpdateChunkFilename: `../.hot/hot-update.js`,
                hotUpdateMainFilename: `../.hot/hot-update.json`
            },

            optimization: {
                removeAvailableModules: false,
                removeEmptyChunks: false,
                splitChunks: false,
            },

            plugins: [
                // js
                new ESLintPlugin({
                    extensions: 'js',
                    emitWarning: true,
                    files: path.resolve(this.appPath, './src'),
                }),

                // scss
                new StyleLintPlugin({
                    configFile: path.resolve(this.appPath, './.stylelintrc'),
                    files: path.join('src', '**/*.s?(a|c)ss'),
                }),

            ],
            module: {
                rules: [
                    {
                        test: /\.html?$/,
                        loader: "template-literals-loader"
                    },
                    {
                        test: /\.scss$/, use: ['style-loader', {
                            loader: 'file-loader', options: {
                                name: '[name].css',
                                outputPath: '../../dist/dev/css/'
                            }
                        }, {
                            loader: 'sass-loader', options: {
                                sourceMap: true,
                            },
                        }],
                    }],
            },

            watch: true,

            watchOptions: {
                aggregateTimeout: 300,
                poll: 300,
                ignored: ['**/node_modules'],
            }
        };
    }
}

// run it
new WebpackDev();

