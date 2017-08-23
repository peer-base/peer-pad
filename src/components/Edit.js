import React, { Component } from 'react';
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { decode as b58Decode } from 'bs58'
import EventEmitter from 'events'
import IPFS from '../ipfs'
import parseKeys from '../keys/parse'
import CRDT from '../crdt'
import Snapshoter from '../snapshoter'
import authToken from '../auth-token'

import Status from './Status'
import Peers from './Peers'
import Snapshots from './Snapshots'
import Links from './Links'

class Edit extends Component {

  constructor (props) {
    super(props)
    const { readKey, writeKey } = props.match.params
    this.state = {
      status: 'offline',
      room: {},
      peers: [],
      canEdit: !!writeKey,
      rawKeys: {
        id: readKey,
        read: readKey,
        write: writeKey
      }
    }
  }

  render () {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9">
            <div id="editor"></div>
          </div>

          <div className="col-md-3">

            <Links keys={this.state.rawKeys} />
            <Status status={this.state.status} />
            <Peers peers={this.state.peers} />
            <Snapshots takeSnapshot={this.takeSnapshot.bind(this)} />
          </div>
        </div>
      </div>)
  }

  async componentDidMount () {

    // Keys
    const rawKeys = this.state.rawKeys
    this.state.keys = await parseKeys(b58Decode(rawKeys.read), b58Decode(rawKeys.write))

    const ipfs = await IPFS()
    this.setState({status: 'online'})

    const auth = await authToken(ipfs, this.state.keys)

    // Room

    const roomChanged = () => {
      this.setState({peers: Object.keys(this.state.room).sort()})
    }

    const roomEmitter = new EventEmitter()
    roomEmitter.on('peer joined', (peer) => {
      this.state.room[peer] = {
        // TODO: just by knowing the public key, can a user read?
        // Perhaps turn this into an option?
        canRead: true
      }

      roomChanged()
    })

    roomEmitter.on('peer left', (peer) => {
      delete this.state.room[peer]
      roomChanged()
    })

    // Editor

    const editor = this.state.editor = new Quill('#editor', {
      theme: 'snow'
    })

    if (!this.state.canEdit) {
      editor.disable()
    }

    await CRDT(rawKeys.id, auth.token, this.state.canEdit, this.state.keys, this.state.room, ipfs, editor, roomEmitter)


    // Snapshots

    this.state.takeSnapshot = Snapshoter(ipfs, this.state.keys.cipher)
  }

  async takeSnapshot () {
    return this.state.takeSnapshot(this.state.editor.root.innerHTML)
  }
}


export default Edit

