import EventEmitter from 'events'

export default function auth (keys, roomEmitter) {
  const emitter = new EventEmitter()
  const capabilitiesByPeer = {}

  roomEmitter.on('peer joined', (peer) => {
    const capabilities = ensurePeer(peer)

    emitter.emit('change', peer, capabilities)
  })

  roomEmitter.on('peer left', (peer) => {
    delete capabilitiesByPeer[peer]
    emitter.emit('change', peer, null)
  })

  emitter.add = addPermission
  emitter.remove = removePermission
  emitter.get = getPermissions

  emitter.verifySignature = verifySignature
  emitter.checkAuth = checkAuth

  emitter.observer = observer

  return emitter

  function ensurePeer (peerId) {
    let capabilities = capabilitiesByPeer[peerId]
    if (!capabilities) {
      capabilities = capabilitiesByPeer[peerId] = {
        read: true, // TODO: is this ok?
        write: false,
        admin: false
      }
    }

    return capabilities
  }

  function addPermission (peerId, permission) {
    let capabilities = ensurePeer(peerId)
    capabilities[permission] = true
    emitter.emit('change', peerId, capabilities)
  }

  function removePermission (peerId, permission) {
    const capabilities = ensurePeer(peerId)
    capabilities[permission] = false
    emitter.emit('change', peerId, capabilities)
  }

  function getPermissions (peerId) {
    const capabilities = capabilitiesByPeer[peerId] || {}
    return Object.keys(capabilities).filter((capability) => capabilities[capability] === true)
  }

  function verifySignature (peer, payload, signature, callback) {
    const capabilities = capabilitiesByPeer[peer]
    if (!signature) {
      if (capabilities && capabilities.read && !capabilities.write) {
        setImmediate(() => callback(null, true))
      } else {
        setImmediate(() => callback(null, false))
      }
    } else {
      keys.read.verify(payload, signature, callback)
    }
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
          const capabilities = ensurePeer(sender)
          capabilities.read = true
          capabilities.write = true
          emitter.emit('change', sender, capabilities)
          resolve('write')
        })
    })
  }

  function observer () {
    return (event) => {
      // event.path // contains path
      switch (event.type) {
        case 'add':
        case 'update':
        case 'delete':
        default:
      }
    }
  }
}
