const path = require('path');

module.exports = {
    entry: './main',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              use: ['babel-loader'],
              // 排除 node_modules 目录下的文件，node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
              exclude: path.resolve(__dirname, 'node_modules'),
            },
            // {
            //     test: /\.css/,
            //     use: ['style-loader', 'css-loader', 'postcss-loader']
            // }
        ]
    },
    devtool: 'source-map'
}