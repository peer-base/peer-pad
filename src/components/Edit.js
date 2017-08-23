import React, { Component } from 'react';
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { decode as b58Decode } from 'bs58'
import EventEmitter from 'events'
import waterfall from 'async/waterfall'
import IPFS from '../ipfs'
import parseKeys from '../keys/parse'
import CRDT from '../crdt'
import Snapshoter from '../snapshoter'

class Edit extends Component {

  constructor (props) {
    super(props)
    const { readKey, writeKey } = props.match.params
    this.state = {
      status: 'offline',
      room: {},
      peers: [],
      snapshots: [],
      canEdit: !!writeKey,
      rawKeys: {
        id: readKey,
        read: b58Decode(readKey),
        write: writeKey && b58Decode(writeKey)
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
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Share links</h3>
              </div>
              <div className="panel-body">
                <ul id="peers" className="list-unstyled">
                  <li><a href="/{this.state.rawKeys.read}/{this.shahe.rawKeys.write}">Writable</a></li>
                  <li><a href="/{this.state.rawKeys.read}">Read-only</a></li>
                </ul>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Status</h3>
              </div>
              <div className="panel-body">
                {this.state.status}
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Peers</h3>
              </div>
              <div className="panel-body">
                <ul id="peers" className="list-unstyled" style={{fontSize: '50%'}}>
                  {this.state.peers.map((peer) => <li key={peer}>{peer}</li>)}
                </ul>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Snapshots
                  <button className="button" onClick={this.handleSnap.bind(this)}>Snap</button>
                </h3>
              </div>
              <div className="panel-body">
                <ul className="list-unstyled" style={{fontSize: '50%'}}>
                  {this.state.snapshots.map((ss, index) => <li key={index}><a href={ss.url}>{ss.hash}</a></li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>)
  }

  async componentDidMount () {

    // Keys
    const rawKeys = this.state.rawKeys
    this.state.keys = await parseKeys(rawKeys.read, rawKeys.write)

    const ipfs = await IPFS()
    this.setState({status: 'online'})

    const auth = await authTokenFromIpfsId(ipfs, this.state.keys)

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

    this.state.snapshoter = Snapshoter(ipfs, this.state.keys.cipher)

    this.state.snapshoter.on('saved', (snap) => {
      this.state.snapshots.unshift({
        url: encodeURIComponent(this.state.rawKeys.id) + '/' + encodeURIComponent(snap.hash),
        hash: snap.hash
      })
      this.setState({snapshots: this.state.snapshots})
    })
  }

  handleSnap () {
    this.state.snapshoter.save(this.state.editor.root.innerHTML)
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

