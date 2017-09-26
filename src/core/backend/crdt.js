import Y from 'yjs'

import YMemory from 'y-memory'
import YIndexeddb from 'y-indexeddb'
import YArray from 'y-array'
import YMap from 'y-map'
import YRichtext from 'y-richtext'
import YIPFS from 'y-ipfs-connector'

YMemory(Y)
YIndexeddb(Y)
YArray(Y)
YMap(Y)
YRichtext(Y)
YIPFS(Y)

export default async function startCRDT (id, authToken, keys, ipfs, roomEmitter, auth) {
  const connectorOptions = {
    name: 'ipfs',
    room: roomName(id),
    ipfs: ipfs,
    auth: authToken,
    roomEmitter: roomEmitter,
    verifySignature: auth.verifySignature,
    checkAuth: auth.checkAuth
  }

  if (keys.write) {
    connectorOptions.sign = sign
  }

  connectorOptions.role = keys.write ? 'master' : 'slave'

  return await Y({
    db: {
      name: 'indexeddb'
    },
    connector: connectorOptions,
    share: {
      richtext: 'Richtext',
      access: 'Map'
    }
  })

  // Signatures

  function sign (m, callback) {
    keys.write.sign(m, callback)
  }
}

function roomName (id) {
  return 'peerpad/' + id.substring(0, Math.round(id.length / 2))
}
