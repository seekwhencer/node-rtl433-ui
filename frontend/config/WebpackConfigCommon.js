import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default class WebpackConfigCommon {
    constructor(parent) {
        this.parent = parent;
        this.build();
    }

    build() {
        this.config = {

            plugins: [
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: path.resolve(this.parent.appPath, './public'),
                            to: '.'
                        }
                    ]
                })
            ],

            resolve: {
                alias: {
                    '~': path.resolve(this.parent.appPath, './src'),
                },
            },

            module: {
                rules: [
                    {
                        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg)(\?.*)?$/,
                        use: {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                            },
                        },
                    },
                    {
                        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].[ext]',
                                    outputPath: './prod/css/fonts/'
                                }
                            }
                        ]
                    }
                ],
            },
        };
    }
}

