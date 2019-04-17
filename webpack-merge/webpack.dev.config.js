const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const devConfig = {
    // mode: 'production',
    mode: 'development',
}

module.exports = merge(baseConfig, devConfig)