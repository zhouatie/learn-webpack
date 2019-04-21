const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        port: 8889,
        hot: true,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // 可以在此处指定publicPath
                        // 默认情况下，它在webpackoptions.output中使用publicPath
                        publicPath: '../',
                        // hmr: process.env.NODE_ENV === 'development',
                    },
                }, 'css-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name][contenthash].js'
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            // 与webpackoptions.output中相同选项类似的选项
            // 两个选项都是可选的
            filename: '[name][contenthash].css',
            chunkFilename: '[id][contenthash].css',
        }),
    ]
}
