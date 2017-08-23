import Y from 'yjs'

import YMemory from 'y-memory'
import YIndexeddb from 'y-indexeddb'
import YArray from 'y-array'
import YRichtext from 'y-richtext'
import YIPFS from 'y-ipfs-connector'

export default async function startCRDT(id, authToken, canEdit, keys, room, ipfs, editor, roomEmitter) {

  YMemory(Y)
  YIndexeddb(Y)
  YArray(Y)
  YRichtext(Y)
  YIPFS(Y)

  const connectorOptions = {
    name: 'ipfs',
    room: roomName(id),
    ipfs: ipfs,
    verifySignature: verifySignature,
    auth: authToken,
    checkAuth: checkAuth,
    roomEmitter: roomEmitter
  }

  if (canEdit) {
    connectorOptions.sign = sign
  }

  connectorOptions.role = canEdit ? 'master' : 'slave'

  return Y({
    db: {
      name: 'indexeddb'
    },
    connector: connectorOptions,
    share: {
      richtext: 'Richtext'
    }
  }).then((y) => {
    y.share.richtext.bindQuill(editor)
  })

  // Signatures

  function sign (m, callback) {
    keys.private.sign(m, callback)
  }

  function verifySignature (peer, payload, signature, callback) {
    setImmediate(() => {
      const capabilities = room[peer]
      if (!signature) {
        if (capabilities && capabilities.canRead && !capabilities.canWrite) {
          setImmediate(() => callback(null, true))
        } else {
          setImmediate(() => callback(null, false))
        }
      } else {
        keys.public.verify(payload, signature, callback)
      }
    })
  }

  function checkAuth (authToken, y, sender) {
    return new Promise((resolve, reject) => {
      if (!authToken) {
        // TODO: is this correct?
        return resolve('read')
      }

      verifySignature(
        sender,
        Buffer.from(sender),
        Buffer.from(authToken, 'base64'),
        (err, ok) => {
          if (err) { throw err }
          if (!ok) {
            return console.error('invalid signature for sender ' + sender)
          }
          room[sender].canRead = true
          room[sender].canWrite = true
          resolve('write')
        })
    })
  }
}

function roomName (id) {
  return 'peerpad/' + id.substring(0, Math.round(id.length / 2))
}
