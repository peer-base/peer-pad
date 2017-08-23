import waterfall from 'async/waterfall'

export default (ipfs, cipher) => {
  return async function saveToIPFS (doc) {
    const clear = Buffer.from(doc)

    return new Promise((resolve, reject) => {
      waterfall([
        (callback) => cipher(callback),
        (cipher, callback) => cipher.encrypt(clear, callback),
        (ciphered, callback) => ipfs.files.add(ciphered, callback),
        (resArray, callback) => callback(null, resArray[resArray.length - 1])
      ], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}
