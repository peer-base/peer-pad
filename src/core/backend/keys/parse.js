import crypto from 'libp2p-crypto'
import parallel from 'async/parallel'

export default async function parseKeys (readKey, writeKey) {
  return new Promise((resolve, reject) => {
    parallel({
      'read': (callback) => callback(null, crypto.keys.unmarshalPublicKey(readKey)),
      'write': (callback) => writeKey ? crypto.keys.unmarshalPrivateKey(writeKey, callback) : callback(null, null),
      'cipher': (callback) => callback(null, createAESKeyFromReadKey(readKey))
    }, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

function createAESKeyFromReadKey (key) {
  const keyBytes = key.slice(0, 32)
  const iv = key.slice(32, 32 + 16)
  return (callback) => crypto.aes.create(keyBytes, iv, callback)
}
