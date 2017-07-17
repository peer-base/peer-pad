'use strict'

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

      // IPFS

      const IPFS = require('ipfs')

      const ipfs = new IPFS({
        repo: 'ipfs/peerped/' + Math.random(),
        EXPERIMENTAL: {
          pubsub: true
        }
      })

      ipfs.once('ready', () => ipfs.id((err, info) => {
        console.log('IPFS node started with ID ' + info.id)
      }))


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
        verifySignature: verifySignature
      }

      if (canEdit) {
        connectorOptions.sign = sign
      }

      connectorOptions.role = canEdit ? 'master' : 'slave'

      Y({
        db: {
          name: 'memory'
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

      // Signatures

      function sign (m, callback) {
        keys.private.sign(m, callback)
      }

      function verifySignature (payload, signature, callback) {
        keys.public.verify(payload, signature, callback)
      }
    })
}
