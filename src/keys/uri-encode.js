'use strict'

const bs58 = require('bs58')

module.exports = function encodeKey (key) {
  return encodeURIComponent(bs58.encode(Buffer.from(key)))
}
