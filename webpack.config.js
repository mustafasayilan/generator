const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
    const isDevelopment = options.mode === 'development';

    return {
        entry: './views/index.ejs', // Ana EJS dosyanızın yolu
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.ejs$/,
                    use: [
                        {
                            loader: 'ejs-loader',
                            options: {
                                esModule: false
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './views/index.ejs', // EJS dosyanızın yolu
                filename: 'index.html'
            }),
            new MiniCssExtractPlugin()
        ]
    };
};
