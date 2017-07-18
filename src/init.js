'use strict'

const waterfall = require('async/waterfall')
const setImmediate = require('async/setImmediate')
const EventEmitter = require('events')
const Keys = require('./keys')

module.exports = function init () {
  const keys = window.location.hash.substring(1).split('/')
  const id = decodeURIComponent(keys[0])
  const secretKey = keys[1] && decodeURIComponent(keys[1])
  const canEdit = Boolean(secretKey)

  Keys.from(
    Buffer.from(id, 'base64'),
    secretKey && Buffer.from(secretKey, 'base64'),
    (err, keys) => {
      if (err) {
        console.error(err)
        alert(err.message)
        return
      }
      // document elements
      const $hash = document.getElementById('hash')
      const $url = document.getElementById('url')
      const $link = document.getElementById('link')
      const $publicLink = document.getElementById('publiclink')
      const $publicLinkInput = document.getElementById('publiclinkinput')

      $publicLinkInput.value = $publicLink.href = '/doc.html/#' + encodeURIComponent(id)

      let observer

      // Quill editor

      const editor = new Quill('#editor', {
        theme: 'snow'
      })

      if (!canEdit) {
        editor.disable()
      }

      // Room

      const room = {}
      const roomEmitter = new EventEmitter()
      roomEmitter.on('peer joined', (peer) => {
        room[peer] = {
          // TODO: just by knowing the channel, users can read?
          // Perhaps turn this into an option?
          canRead: true
        }
      })
      roomEmitter.on('peer left', (peer) => {
        delete room[peer]
      })

      // IPFS

      const IPFS = require('ipfs')

      const ipfs = new IPFS({
        EXPERIMENTAL: {
          pubsub: true
        }
      })

      ipfs.once('ready', () => {
        authTokenFromIpfsId(ipfs, keys, (err, authToken, thisNodeId) => {
          if (err) {
            console.error(err)
            alert(err.message)
            return
          }

          console.log('IPFS node started with ID ' + thisNodeId)

          if (canEdit) {
            const saver = require('./view-saver')(ipfs)

            saver.on('error', (err) => {
              // TODO: handle error
              console.error(err)
            })

            saver.on('saved', (res) => {
              $hash.value = res.hash
              const url = 'https://gateway.ipfs.io/ipfs/' + res.hash
              $url.value = url
              $link.href = url
            })

            observer = (event) => {
              const html = editor.root.innerHTML
              saver.save(html)
            }
          }

          // Yjs

          const Y = require('yjs')
          require('y-memory')(Y)
          require('y-indexeddb')(Y)
          require('y-array')(Y)
          require('y-richtext')(Y)
          require('y-ipfs-connector')(Y)

          const connectorOptions = {
            name: 'ipfs',
            room: 'peerpad/' + id,
            ipfs: ipfs,
            verifySignature: verifySignature,
            auth: authToken,
            checkAuth: checkAuth,
            roomEmitter: roomEmitter
          }

          if (canEdit) {
            connectorOptions.sign = sign
          }

          connectorOptions.role = canEdit ? 'master' : 'slave'

          Y({
            db: {
              name: 'indexeddb'
            },
            connector: connectorOptions,
            share: {
              richtext: 'Richtext'
            }
          }).then((y) => {
            y.share.richtext.bindQuill(editor)
            if (observer) {
              y.share.richtext.observe(observer)
            }
            console.log('Yjs is bound to editor')
          })
        })
      })

      // Signatures

      function sign (m, callback) {
        keys.private.sign(m, callback)
      }

      function verifySignature (peer, payload, signature, callback) {
        setImmediate(() => {
          const capabilities = room[peer]
          if (!signature) {
            if (capabilities && capabilities.canRead && !capabilities.canWrite) {
              setImmediate(() => callback(null, true))
            } else {
              setImmediate(() => callback(null, false))
            }
          } else {
            keys.public.verify(payload, signature, callback)
          }
        })
      }

      function checkAuth (authToken) {
        const p = new Promise((resolve, reject) => {

          // TODO: FIXME: major hack, going through the Yjs internals.. :(
          setImmediate(() => {
            const sender =
              Object.keys(this.connections).find((peer) => this.connections[peer].auth === p)
            if (!sender) {
              throw new Error('could not find sender for auth token')
            }

            if (!authToken) {
              // TODO: is this correct?
              return resolve('read')
            }

            verifySignature(
              sender,
              Buffer.from(sender),
              Buffer.from(authToken, 'base64'),
              (err, ok) => {
                if (err) { throw err }
                if (!ok) {
                  return console.error('invalid signature for sender ' + sender)
                }
                room[sender].canRead = true
                room[sender].canWrite = true
                resolve('write')
              })
          })
        })
        return p
      }
    }
  )
}

function authTokenFromIpfsId (ipfs, keys, callback) {
  let thisNodeId
  waterfall(
    [
      (cb) => ipfs.id(cb),
      (info, cb) => {
        cb(null, info.id)
      },
      (nodeId, cb) => {
        if (!keys.private) {
          cb(null, null)
        }
        thisNodeId = nodeId
        keys.private.sign(Buffer.from(nodeId), cb)
      },
      (signature, cb) => {
        cb(null, signature && signature.toString('base64'), thisNodeId)
      }
    ],
    callback
  )
}
