import './main.less'
require('./index.css')
const body = document.querySelector('body')
body.onclick = function() {
    const div = document.createElement('div')
    div.innerHTML = 'item'
    body.appendChild(div)
}