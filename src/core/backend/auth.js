import EventEmitter from 'events'

export default function Auth (keys, roomEmitter) {
  const auth = new EventEmitter()
  const capabilitiesByPeer = {}

  roomEmitter.on('peer joined', (peerId) => {
    const capabilities = ensurePeer(peerId)

    auth.emit('change', peerId, capabilities)
  })

  roomEmitter.on('peer left', (peerId) => {
    delete capabilitiesByPeer[peerId]
    auth.emit('change', peerId, null)
  })

  auth.add = addPermission
  auth.remove = removePermission
  auth.get = getPermissions

  auth.verifySignature = verifySignature
  auth.checkAuth = checkAuth

  auth.observer = observer

  return auth

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
    auth.emit('change', peerId, capabilities)
  }

  function removePermission (peerId, permission) {
    const capabilities = ensurePeer(peerId)
    capabilities[permission] = false
    auth.emit('change', peerId, capabilities)
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
          auth.emit('change', sender, capabilities)
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
