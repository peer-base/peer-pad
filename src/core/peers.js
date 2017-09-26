const EventEmitter = require('events')

class Peers extends EventEmitter {
  constructor (options, backend) {
    super()

    this._peers = {}

    backend.once('started', () => {
      backend.auth.on('change', (peerId, capabilities) => {
        if (!capabilities) {
          delete this._peers[peerId]
        } else {
          let peer = this._peers[peerId]
          if (!peer) {
            peer = this._peers[peerId] = {
              id: peerId
            }
          }
          peer.permissions = Object.assign({}, capabilities)
        }

        this._roomChanged()
      })
    })
  }

  all () {
    return this._peers
  }

  _roomChanged () {
    this.emit('change')
  }
}

export default Peers
