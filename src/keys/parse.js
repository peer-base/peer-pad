import crypto from 'libp2p-crypto'
import parallel from 'async/parallel'

export default async function parseKeys (publicKey, privateKey) {
  return new Promise((resolve, reject) => {
    parallel({
      'public': (callback) => callback(null, crypto.keys.unmarshalPublicKey(publicKey)),
      'private': (callback) => privateKey ? crypto.keys.unmarshalPrivateKey(privateKey, callback) : callback(null, null),
      'cipher': (callback) => callback(null, createAESKeyFromPublicKey(publicKey))
    }, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

function createAESKeyFromPublicKey (key) {
  const keyBytes = key.slice(0, 32)
  const iv = key.slice(32, 32 + 16)
  return (callback) => crypto.aes.create(keyBytes, iv, callback)
}
