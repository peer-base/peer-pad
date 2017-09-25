import React, { Component } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

import Peerpad from '../core'

import Status from './Status'
import Peers from './Peers'
import Snapshots from './Snapshots'
import Links from './Links'

class Edit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      status: 'offline',
      room: {},
      peers: [],
      canEdit: !!writeKey,
      rawKeys: {
        read: readKey,
        write: writeKey
      }
    }
    const { name, readKey, writeKey } = props.match.params

    const peerpad = this._peerpad = Peerpad({name, readyJey, writeKey})

    peerpad.network.once('started', () => this.setState({ status: 'started' }))
    peerpad.peers.on('change', () => this.setState({ peers: [...peerpad.peers.all()] }))
  }

  render () {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-9'>
            <div id='editor' />
          </div>

          <div className='col-md-3'>

            <Links keys={this.state.rawKeys} />
            <Status status={this.state.status} />
            <Peers peers={this.state.peers} />
            <Snapshots takeSnapshot={this.takeSnapshot.bind(this)} />
          </div>
        </div>
      </div>)
  }

  async componentDidMount () {
    await this._peerpad.start()

    // Keys
    const rawKeys = this.state.rawKeys
    this.state.keys = await parseKeys(b58Decode(rawKeys.read), rawKeys.write && b58Decode(rawKeys.write))

    // Editor

    const editor = this._editor = new Quill('#editor', {
      theme: 'snow'
    })

    if (!this.state.canEdit) {
      editor.disable()
    }

    await this._peerpad.document.bindEditor(editor)
  }

  async takeSnapshot () {
    if (this._editor) {
      await this._peerpad.snapshots.take()
    }
  }
}

export default Edit
