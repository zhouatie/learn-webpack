// // 通过 CommonJS 规范导入 show 函数
// const show = require('./show.js');
// // 执行 show 函数
// show('Webpack');

// 通过 CommonJS 规范导入 CSS 模块
// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
setTimeout(function() {
    show('Webpack hahah');
},2000)