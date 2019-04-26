const express = require('express')
const app = express()

app.get('/api/list', (req, res) => {
    console.log(req, 'req')
    res.json({
        success: true
    })
})

app.listen(8888, () => {
    console.log('listening localhost:8888')
})