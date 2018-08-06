const b58Decode = require('bs58').decode
const crypto = require('libp2p-crypto')
const pify = require('pify')

const createKey = pify(crypto.aes.create.bind(crypto.aes))

const defaultOptions = {
  keyLength: 32,
  ivLength: 16
}

function parseSymmetricalKey (string, _options) {
  const options = Object.assign({}, defaultOptions, _options)
  const rawKey = b58Decode(string)

  return createKey(
    rawKey.slice(0, options.keyLength),
    rawKey.slice(options.keyLength, options.keyLength + options.ivLength))
}

module.exports = parseSymmetricalKey
