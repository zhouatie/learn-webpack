const loaderUtils = require('loader-utils')

// 函数不能使用箭头函数
// module.exports = function(source) {
//     // console.log(source, this.query, 'source')
//     const options = loaderUtils.getOptions(this)
//     console.log(options, 'options')
//     return source.replace('atie', 'world')
// }

// module.exports = function(source) {
//     const options = loaderUtils.getOptions(this)
//     const result = source.replace('atie', options.name)
//     this.callback(null, result)
// }

// module.exports = function(source) {
//     setTimeout(() => {
//         return source.replace('atie', 'world')
//     }, 1000)
// }

module.exports = function(source) {
    const callback = this.async()
    setTimeout(() => {
        callback(null, source.replace('atie', 'world'))
    }, 2000)
}