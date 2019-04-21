// async function getComponent() {
//     const { default: _ } = await import(/* webpackChunkNanem:'lodash */ 'lodash')
//     const element = document.createElement('div')
//     element.innerHTML = _.join(['Dell', 'Lee'], '-')
//     return element
// }
// document.addEventListener('click', () => {
//     getComponent().then(element => {
//         document.body.appendChild(element)
//     })
// })
import _ from 'lodash'
console.log(_.join(['Dell', 'Lee'], '-'))