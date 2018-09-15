// 操作 DOM 元素，把 content 显示到网页上
function show(content) {
    window.document.getElementById('app').innerText = '1222999H6e3llo,' + content;
  }
  
  // 通过 CommonJS 规范导出 show 函数
  module.exports = show;