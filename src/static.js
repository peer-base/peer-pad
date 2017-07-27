'use strict'

const waterfall = require('async/waterfall')
const concat = require('concat-stream')
const uriDecode = require('./keys/uri-decode')

const keys = window.location.hash.substring(1).split('/')
const key = uriDecode(keys[0])
const hash = decodeURIComponent(keys[1])

$.LoadingOverlay('show')

require('./keys/parse')(key, null, (err, keys) => {
  if (err) { throw err }

  const IPFS = require('ipfs')

  const ipfs = new IPFS({
    EXPERIMENTAL: {
      pubsub: true
    }
  })

  ipfs.once('ready', () => {
    waterfall([
      (callback) => ipfs.files.get(hash, callback),
      (stream, callback) => {
        stream.on('data', (file) => {
          file.content.pipe(concat((content) => callback(null, content)))
        })
      },
      (content, callback) => {
        keys.cipher((err, cypher) => {
          if (err) { return callback(err) }
          cypher.decrypt(content, callback)
        })
      }
    ], (err, content) => {
      if (err) {
        throw err
      }

      $.LoadingOverlay('hide')
      document.getElementById('content').innerHTML = content.toString()
    })
  })
})