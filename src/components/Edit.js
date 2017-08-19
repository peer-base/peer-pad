import React, { Component } from 'react';
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { decode as b58Decode } from 'bs58'
import EventEmitter from 'events'
import waterfall from 'async/waterfall'
import IPFS from '../ipfs'
import parseKeys from '../keys/parse'
import CRDT from '../crdt'

class Edit extends Component {

  constructor (props) {
    super(props)
    const { readKey, writeKey } = props.match.params
    this.state = {
      room: {},
      canEdit: !!writeKey,
      rawKeys: {
        id: readKey,
        read: b58Decode(readKey),
        write: writeKey && b58Decode(writeKey)
      }
    }
  }

  render () {
    return (<div id="editor"></div>)
  }

  async componentDidMount () {

    // Keys
    const rawKeys = this.state.rawKeys
    this.state.keys = await parseKeys(rawKeys.read, rawKeys.write)

    const ipfs = await IPFS()
    const auth = await authTokenFromIpfsId(ipfs, this.state.keys)

    // Room

    const roomEmitter = new EventEmitter()
    roomEmitter.on('peer joined', (peer) => {
      this.state.room[peer] = {
        // TODO: just by knowing the public key, can a user read?
        // Perhaps turn this into an option?
        canRead: true
      }
    })

    roomEmitter.on('peer left', (peer) => {
      delete this.state.room[peer]
    })

    // Editor

    const editor = new Quill('#editor', {
      theme: 'snow'
    })

    if (!this.state.canEdit) {
      editor.disable()
    }

    await CRDT(rawKeys.id, auth.token, this.state.canEdit, this.state.keys, this.state.room, ipfs, editor, roomEmitter)
  }
}

async function authTokenFromIpfsId (ipfs, keys) {
  return new Promise((resolve, reject) => {
    let thisNodeId
    waterfall(
      [
        (cb) => ipfs.id(cb),
        (info, cb) => {
          cb(null, info.id)
        },
        (nodeId, cb) => {
          thisNodeId = nodeId
          if (!keys.private) {
            cb(null, null)
          } else {
            keys.private.sign(Buffer.from(nodeId), cb)
          }
        },
        (token, cb) => {
          cb(null, token && token.toString('base64'))
        }
      ],
      (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            token: token,
            nodeId: thisNodeId
          })
        }
      }
    )
  })
}
export default Edit

