'use strict'

const Buffer = require('safe-buffer').Buffer

const $button = document.getElementById('start')

$button.addEventListener('click', () => {
  require('./generate-keys')((err, keys) => {
    if (err) {
      console.error(err)
      $message.innerHTML = err.message
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

function encodeKey (key) {
  return encodeURIComponent(Buffer.from(key).toString('base64'))
}