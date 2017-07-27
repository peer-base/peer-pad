'use strict'

const crypto = require('libp2p-crypto')
const parallel = require('async/parallel')

module.exports = parseKeys

function parseKeys (publicKey, privateKey, callback) {
  parallel({
    'public':  (callback) => callback(null, crypto.unmarshalPublicKey(publicKey)),
    'private': (callback) => privateKey ? crypto.unmarshalPrivateKey(privateKey, callback) : callback(null, null),
    'cipher':  (callback) => callback(null, createAESKeyFromPublicKey(publicKey))
  }, callback)
}

function createAESKeyFromPublicKey (key) {
  const keyBytes = key.slice(0, 32)
  const iv = key.slice(32, 32 + 16)
  return (callback) => crypto.aes.create(keyBytes, iv, callback)
}
