import { keys } from 'libp2p-crypto'

const defaultOptions = {
  algo: 'RSA',
  bits: 1024
}

async function generateKeys (options) {
  return new Promise((resolve, reject) => {
    options = Object.assign({}, defaultOptions, options)
    keys.generateKeyPair(options.algo, options.bits, (err, key) => {
      if (err) { return reject(err) }
      resolve({
        'public': keys.marshalPublicKey(key.public),
        'private': keys.marshalPrivateKey(key)
      })
    })
  })
}

export default generateKeys
