class Copyright {
    constructor() {
        console.log('hello world')
    }
    apply(compiler) {
        compiler.hooks.compile.tap('MyPlugin', params => {
            console.log('以同步方式触及 compile 钩子。');
        })
        compiler.hooks.emit.tapAsync('Copyright', (compilation,callback) => {
            console.log('以具有延迟的异步方式触及 run 钩子。');
        })
    }
}

module.exports = Copyright