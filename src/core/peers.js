const EventEmitter = require('events')

class Peers extends EventEmitter {
  constructor (options, backend) {
    super()

    this._peers = {}

    backend.once('started', () => {
      console.log('backend started')
      backend.auth.on('change', (peerId, capabilities) => {
        console.log('backend auth change', peerId)
        if (!capabilities) {
          delete this._peers[peerId]
        } else {
          let peer = this._peers[peerId]
          if (!peer) {
            peer = this._peers[peer] = {
              id: peer
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
