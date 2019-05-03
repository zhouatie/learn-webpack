import _ from 'lodash'
import $ from 'jquery'

$('body').click(() => {
    $('body').append(`<div>${_.join(['name', 'age'], '---')}</div>`)
})