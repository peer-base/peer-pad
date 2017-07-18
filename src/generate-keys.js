'use strict'

const crypto = require('libp2p-crypto')

const defaultOptions = {
  algo: 'RSA',
  bits: 2048
}

module.exports = (options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options = Object.assign({}, defaultOptions, options)
  crypto.generateKeyPair(options.algo, options.bits, (err, key) => {
    if (err) { return callback(err) }
    callback(null, {
      'public': crypto.marshalPublicKey(key.public),
      'private': crypto.marshalPrivateKey(key)
    })
  })
}
