'use strict'

const bs58 = require('bs58')

module.exports = function decodeKey (key) {
  return bs58.decode(decodeURIComponent(key))
}
