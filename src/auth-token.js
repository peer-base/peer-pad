import waterfall from 'async/waterfall'

export default async function authTokenFromIpfsId (ipfs, keys) {
  return new Promise((resolve, reject) => {
    let thisNodeId
    waterfall(
      [
        (cb) => ipfs.id(cb),
        (info, cb) => {
          cb(null, info.id)
        },
        (nodeId, cb) => {
          thisNodeId = nodeId
          if (!keys.private) {
            cb(null, null)
          } else {
            keys.private.sign(Buffer.from(nodeId), cb)
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
          resolve({
            token: token,
            nodeId: thisNodeId
          })
        }
      }
    )
  })
}
