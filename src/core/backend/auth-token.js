import waterfall from 'async/waterfall'

export default async function authTokenFromIpfsId (ipfs, keys) {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        (cb) => ipfs.id(cb),
        (info, cb) => {
          cb(null, info.id)
        },
        (nodeId, cb) => {
          if (!keys.write) {
            cb(null, null)
          } else {
            keys.write.sign(Buffer.from(nodeId), cb)
          }
        },
        (token, cb) => {
          cb(null, token && token.toString('base64'))
        }
      ],
      (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      }
    )
  })
}
