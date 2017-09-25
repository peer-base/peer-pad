'use strict'

import EventEmitter from 'events'
import { decode as b58Decode } from 'bs58'

import parseKeys from './keys/parse'
import IPFS from './ipfs'
import authToken from './auth-token'
import CRDT from './crdt'

class Backend {
  constructor (options) {
    this._options = options
    this.room = new EventEmitter()
    const ipfs = this.ipfs = IPFS(options.ipfs)
  }

  async start () {
    const options = this._options
    // Keys
    this._keys = await parseKeys(b58Decode(options.readKey), options.writeKey && b58Decode(options.writeKey))

    // if IPFS node is not online yet, delay the start until it is
    if (!this.ipfs.isOnline()) {
      this.ipfs.once('ready', this.start.bind(this))
      return
    }

    const token = await authToken(ipfs, this._keys)
    this.auth = Auth(this._keys, this.room)
    this.crdt = await CRDT(rawKeys.read, token, this._keys, ipfs, this.room, this.auth)
    this.crdt.share.access.observeDeep(auth.observer())
  }
}

export default Backend
