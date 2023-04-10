import path from 'path';
import WebpackConfigClass from './WebpackConfigClass.js';
import StyleLintPlugin from "stylelint-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from "copy-webpack-plugin";
import {CleanWebpackPlugin} from "clean-webpack-plugin";

class WebpackProd extends WebpackConfigClass {
    constructor(options) {
        super();

        this.options = options | {silent: false}
        this.proxyTargetHost = process.env.PROXY_TARGET_HOST || 'localhost';
        this.proxyTargetPort = process.env.PROXY_TARGET_PORT || '3050';
        this.proxyPort = parseInt(process.env.VIRTUAL_PORT) || 9000;

        this.build();
        this.merge();
        !this.options.silent ? this.run() : false;
    }

    build() {
        this.config = {
            entry: {
                app: ['./src/app.js', './src/scss/app.scss']
            },

            target: 'web', mode: 'production',

            output: {
                path: `${this.appPath}/dist/prod`, filename: './js/[name].js'
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

                //
                new CleanWebpackPlugin(), new CopyWebpackPlugin({
                    patterns: [{
                        from: path.resolve(this.appPath, './public'),
                        to: '.',
                        globOptions: {
                            ignore: ["**/dev.html"],
                        }
                    }]
                })
            ],

            optimization: {
                minimize: true, minimizer: [new TerserPlugin({
                    parallel: true, terserOptions: {
                        mangle: true,
                        compress: true, // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    }
                }),],
            },

            module: {
                rules: [{
                    test: /\.html?$/, loader: "template-literals-loader"
                }, {
                    test: /\.scss$/, use: ['style-loader', {
                        loader: 'file-loader', options: {
                            name: '[name].css',
                            outputPath: '../../dist/prod/css/'
                        }
                    }, {
                        loader: 'sass-loader', options: {
                            sourceMap: false,
                        },
                    }],
                }],
            }
        };
    }
}

// run it
new WebpackProd();

