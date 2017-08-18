import crypto from 'libp2p-crypto'
import parallel from 'async/parallel'

export default function parseKeys (publicKey, privateKey, callback) {
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
