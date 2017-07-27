'use strict'

const EventEmitter = require('events')
const debounce = require('lodash.debounce')
const waterfall = require('async/waterfall')

const defaultOptions = {
  debounceMS: 2000,
  maxWaitMS: 5000
}

module.exports = (ipfs, cipher, _options) => {
  let saving = null
  let pending = null

  const options = Object.assign({}, defaultOptions, _options)

  const emitter = new EventEmitter()
  Object.assign(emitter, {
    save: debounce(saveDoc, options.debounceMS, {
      maxWait: options.maxWaitMS
    })
  })

  return emitter

  function saveDoc (doc) {
    console.log('saveDoc', doc)
    if (!saving) {
      saving = doc
      _save()
    } else {
      pending = doc
    }
  }

  function _save () {
    const doc = saving

    saveToIPFS(doc, (err, res) => {
      if (err) {
        emitter.emit('error', err)
        return
      }
      saving = null
      emitter.emit('saved', res)
      if (pending) {
        const doc = pending
        pending = null
        saveDoc(doc)
      }
    })
  }

  function saveToIPFS (doc, callback) {
    emitter.emit('saving', doc)

    const clear = Buffer.from(doc)

    waterfall([
      (callback) => cipher(callback),
      (cipher, callback) => cipher.encrypt(clear, callback),
      (ciphered, callback) => ipfs.files.add(ciphered, callback),
      (resArray, callback) => {
        if (resArray.length !== 1) {
          callback(new Error('result array length returned from IPFS.files.add was ' + resArray.length))
          return
        }
        callback(null, resArray[0])
      }
    ], callback)
  }
}
