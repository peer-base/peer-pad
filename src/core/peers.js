'use strict'

const EventEmitter = require('events')

class Peers extends EventEmitter {
  constructor (options, backend) {
    super()

    this._peers = {}

    backend.auth.on('change', (peer, capabilities) => {
      if (!capabilities) {
        delete this._peers[peer]
      } else {
        let peer = this._peers[peer]
        if (!peer) {
          peer = this._peers[peer] = {
            id: peer
          }
        }
        peer.permissions = Object.assign({}, capabilities)
      }

      this._roomChanged()
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
