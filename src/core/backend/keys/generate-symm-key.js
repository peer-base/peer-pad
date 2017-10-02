import crypto from 'libp2p-crypto'

const defaultOptions = {
  keyLength: 32,
  ivLength: 16
}

function generateSymmetricalKey(_options) {
  const options = Object.assign({}, defaultOptions, _options)
  const rawKey = crypto.randomBytes(options.keyLength + options.ivLength)
  return new Promise((resolve, reject) => {
    crypto.aes.create(rawKey.slice(0, 32), rawKey.slice(32), (err, key) => {
      if (err) {
        return reject(err)
      }
      resolve({
        raw: rawKey,
        key: key
      })
    })
  })
}

export default generateSymmetricalKey
