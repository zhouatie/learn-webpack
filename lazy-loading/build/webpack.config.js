const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js'
    },
    module: {
      rules: [
          {
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            // loader: 'babel-loader'
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ["@babel/plugin-syntax-dynamic-import"]
                } 
            }
          }
      ]  
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            // cacheGroups: {
            //     vendors: {
            //         priority: -10,
            //         filename: 'vendors.js'
            //     },
            //     default: {
            //         priority: -20,
            //         reuseExistingChunk: true,
            //         filename: 'common.js'
            //     }
            // }
        }
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CleanWebpackPlugin()
    ]
}
