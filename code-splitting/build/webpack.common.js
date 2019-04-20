const path = require('path')

module.exports = {
    entry: {
        main: path.resolve(__dirname, '../src/test1.js'),
        lodash: path.resolve(__dirname, '../src/test2.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}