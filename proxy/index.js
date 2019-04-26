import axios from 'axios'

const div = document.createElement('div')
div.innerHTML = 'hahahha'
div.addEventListener('click', () => {
    alert('hahah')
    axios.get('/api/list').then(res => {
        console.log(res)
    })
})

document.body.appendChild(div)