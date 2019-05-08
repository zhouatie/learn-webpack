class Copyright {
    apply(compiler) {
        compiler.hooks.emit.tapAsync('Copyright', (compilation,callback) => {
            console.log(compilation.assets, '以具有延迟的异步方式触及 run 钩子。');
            compilation.assets['copyright.txt'] = {
                source: function() {
                    return 'copyright by atie'
                },
                size: function() {
                    return 17
                }
            }
            callback()
        })
    }
}

module.exports = Copyright