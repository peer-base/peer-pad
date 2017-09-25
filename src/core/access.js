import EventEmitter from 'events'

const PERMISSIONS = ['read', 'write', 'admin']

class Access extends EventEmitter {
  constructor (options, backend) {
    super()
    this._backend = backend
  }

  add (peerId, permission) {
    validatePermission(permission)
    return this._backend.auth.add(peerId, permission)
  }

  remove (peerId, permission) {
    validatePermission(permission)
    return this._backend.auth.remove(peerId, permission)
  }

  get (peerId) {

  }
}

export default Access

function validatePermission (permission) {
  if (PERMISSIONS.indexOf(permission) < 0) {
    throw new Error('invalid permission: ' + permission)
  }
}
