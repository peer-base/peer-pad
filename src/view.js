'use strict'

require('./error-handling')

const waterfall = require('async/waterfall')
const setImmediate = require('async/setImmediate')
const EventEmitter = require('events')
const bs58 = require('bs58')
const parseKeys = require('./keys/parse')

const keys = window.location.hash.substring(1).split('/')
const id = decodeURIComponent(keys[0])
const secretKey = keys[1] && decodeURIComponent(keys[1])
const canEdit = Boolean(secretKey)

$.LoadingOverlay('show')

parseKeys(
  bs58.decode(id),
  secretKey && bs58.decode(secretKey),
  (err, keys) => {
    if (err) {
      console.error(err)
      alert(err.message)
      return
    }

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
        // TODO: just by knowing the public key, can a user read?
        // Perhaps turn this into an option?
        canRead: true
      }

      peersChanged()
    })
    roomEmitter.on('peer left', (peer) => {
      delete room[peer]
      peersChanged()
    })

    function peersChanged () {
      $('#peers').html(Object.keys(room).sort().map(peer => '<li>' + peer + '</li>'))
    }

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

        $.LoadingOverlay('hide')

        if (canEdit) {
          const saver = require('./view-saver')(ipfs, keys.cipher)
          const saves = []

          const $saves = $('#saves')

          saver.on('error', (err) => {
            // TODO: handle error
            console.error(err)
          })

          saver.on('saved', (res) => {
            const staticLink = encodeURIComponent(id) + '/' + encodeURIComponent(res.hash)
            const url = '/static.html/#' + staticLink
            saves.unshift({
              url: url,
              hash: res.hash
            })
            $saves.html(saves.map((save, index) => {
              let label = save.hash
              if (index === 0) {
                label = '<b>' + label + '</b>'
              }
              return '<li><a href="' + save.url + '">' + label + '</a></li>'
            }))
          })

          $('#save').click(() => saver.save(editor.root.innerHTML))
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

    function checkAuth (authToken, y, sender) {
      return new Promise((resolve, reject) => {
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
    }
  }
)

function authTokenFromIpfsId (ipfs, keys, callback) {
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
      (signature, cb) => {
        cb(null, signature && signature.toString('base64'), thisNodeId)
      }
    ],
    callback
  )
}
