const EventEmitter = require('events')

class Network extends EventEmitter {
  constructor (options, backend) {
    super()
    if (!backend.ipfs.isOnline()) {
      backend.ipfs.once('ready', () => {
        this.emit('started')
      })
    }
  }
}

export default Network
