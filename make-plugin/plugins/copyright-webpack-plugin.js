// class Copyright {
//     apply(compiler) {
//         compiler.hooks.compile.tap('MyPlugin', params => {
//             console.log('以同步方式触及 compile 钩子。');
//         })
//         compiler.hooks.emit.tapAsync('Copyright', (compilation,callback) => {
//             console.log(compilation.assets, '以具有延迟的异步方式触及 run 钩子。');
//             compilation.assets['copyright.txt'] = {
//                 source: function() {
//                     return 'copyright by atie'
//                 },
//                 size: function() {
//                     return 17
//                 }
//             }
//             callback()
//         })
//     }
// }
class Copyright {
    constructor(options) {
        // console.log(options, 'this is plugin')
      	this.options = options
    }
    apply(compiler) {
      	console.log(compiler.hooks)
    }
}
module.exports = Copyright