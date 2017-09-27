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

    const { name, readKey, writeKey } = props.match.params

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

    const peerpad = this._peerpad = Peerpad({
      type: 'richtext', // TODO: make this variable
      name,
      readKey,
      writeKey})

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
            <Peers peers={this._peerpad.peers} />
            <Snapshots takeSnapshot={this.takeSnapshot.bind(this)} />
          </div>
        </div>
      </div>)
  }

  async componentDidMount () {
    await this._peerpad.start()

    // Editor

    const editor = this._editor = new Quill('#editor', {
      theme: 'snow'
    })

    if (!this.state.canEdit) {
      editor.disable()
    }

    this._peerpad.document.bindEditor(editor)
  }

  componentWillUnmount () {
    this._peerpad.stop()
  }

  async takeSnapshot () {
    return await this._peerpad.snapshots.take()
  }
}

export default Edit
