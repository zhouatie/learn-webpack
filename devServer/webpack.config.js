const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "development",
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    devServer: {
        contentBase: './dist',
        open: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
            // {
            //     test: /\.less$/,
            //     use: ['style-loader', {
            //         loader: 'css-loader',
            //         options: {
            //             importLoaders: 2
            //         }
            //     }, 'less-loader']
            // }
            // {
            //     loader: 'style-loader' // creates style nodes from JS strings
            // }, {
            //     loader: 'css-loader' // translates CSS into CommonJS
            // }, {
            //     loader: 'less-loader' // compiles Less to CSS
            // }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.template.html'
        })
    ]
}