const path = require('path');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const { WebPlugin } = require('web-webpack-plugin');

module.exports = {
    entry: './main.js',
    output: {
        filename: '[name]_[chunkhash:8].js',
        path: path.resolve(__dirname, './dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: path.resolve(__dirname, 'node_modules'),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize']
                })
            }
        ]
    },
    plugins: [
        new WebPlugin({
            template: './template.html',
            filename: 'index.html'
        }),
        new ExtractTextPlugin({
            filename: `[name]_[contenthash:8].css`
        }),
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            }
        }),
        new UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: true,
                collapse_vars: true,
                reduce_vars: true,
            }
        })
    ]
}