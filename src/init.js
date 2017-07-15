'use strict'

module.exports = function init () {
  // Quill

  const editor = new Quill('#editor', {
    modules: {
      toolbar: '#toolbar'
    },
    theme: 'snow'
  })

  // IPFS

  const IPFS = require('ipfs')

  const ipfs = new IPFS({
    repo: repo(),
    EXPERIMENTAL: {
      pubsub: true
    }
  })

  ipfs.once('ready', () => ipfs.id((err, info) => {
    console.log('IPFS node started with ID ' + info.id)
  }))

  const saver = require('./view-saver')(ipfs)

  saver.on('error', (err) => {
    // TODO: handle error
    console.error(err)
  })

  saver.on('saved', (hash) => {
    console.log('saved, hash = ' + hash)
  })

  const observer = (event) => {
    const delta = event.object.toDelta()
    saver.save(delta)
  }

  // Yjs

  const Y = require('yjs')
  require('y-memory')(Y)
  require('y-indexeddb')(Y)
  require('y-array')(Y)
  require('y-richtext')(Y)
  require('y-ipfs-connector')(Y)

  Y({
    db: {
      name: 'indexeddb'
    },
    connector: {
      name: 'ipfs',
      room: 'peerpad-richtext-example',
      ipfs: ipfs
    },
    share: {
      richtext: 'Richtext'
    }
  }).then((y) => {
    y.share.richtext.bindQuill(editor)

    y.share.richtext.observe(observer)
  })
}

function repo () {
  return 'ipfs/peerpad/' + Math.random()
}