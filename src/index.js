'use strict'

const Buffer = require('safe-buffer').Buffer
const encodeKey = require('./keys/uri-encode')

const $button = document.getElementById('start')

$button.addEventListener('click', () => {
  require('./keys/generate')((err, keys) => {
    if (err) {
      console.error(err)
      alert(err.message)
      return
    }

    console.log('public key:', keys.public)
    console.log('private key:', keys.private)

    console.log('private key length', keys.private.length)
    console.log('public key length', keys.public.length)

    window.location.href = '/doc.html/#' +
      encodeKey(keys.public) + '/' + encodeKey(keys.private)
  })
})
