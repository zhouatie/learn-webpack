import '@babel/polyfill'

// babel基本用法

// const arr = [1,2,3]
// const copyArr = arr.map(o => 2 * o)
// console.log(copyArr, 'copyArr')

// babel应用到react中

import React, { Component } from 'react'
import ReactDom from 'react-dom'

class App extends Component {
    render() {
        return <div>hello</div>
    }
}

ReactDOM.render(<App/>, document.getElementById('root'))