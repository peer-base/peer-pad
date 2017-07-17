'use strict'

module.exports = function init () {
  const keys = window.location.hash.substring(1).split('/')
  const id = keys[0]
  const secretKey = keys[1]
  const canEdit = Boolean(secretKey)

  // document elements
  const $hash = document.getElementById('hash')
  const $url = document.getElementById('url')
  const $link = document.getElementById('link')

  let observer

  // Quill

  const quillModules = {
    toolbar: '#toolbar'
  }
  if (!canEdit) {
    quillModules.toolbar = false
  } else {
    document.getElementById('toolbar').style.display = 'block'
  }
  const editor = new Quill('#editor', {
    modules: quillModules,
    theme: 'snow'
  })

  if (!canEdit) {
    editor.disable()
  }

  // IPFS

  const IPFS = require('ipfs')

  const ipfs = new IPFS({
    // repo: repo(),
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

  Y({
    db: {
      name: 'indexeddb'
    },
    connector: {
      name: 'ipfs',
      room: 'peerpad/' + id,
      ipfs: ipfs
    },
    share: {
      richtext: 'Richtext'
    }
  }).then((y) => {
    y.share.richtext.bindQuill(editor)
    if (observer) {
      y.share.richtext.observe(observer)
    }
  })
}

function repo () {
  return 'ipfs/peerpad/' + Math.random()
}