'use strict'

const EventEmitter = require('events')
const debounce = require('lodash.debounce')

const defaultOptions = {
  debounceMS: 2000,
  maxWaitMS: 5000
}

module.exports = (ipfs, _options) => {
  let saving = null
  let pending = null

  const options = Object.assign({}, defaultOptions, _options)

  const emitter = new EventEmitter()
  Object.assign(emitter, {
    save: debounce(saveDelta, options.debounceMS, {
      maxWait: options.maxWaitMS
    })
  })

  return emitter

  function saveDelta(delta) {
    console.log('saveDelta', delta)
    if (!saving) {
      saving = delta
      _save()
    } else {
      pending = delta
    }
  }

  function _save () {
    const delta = saving

    saveToIPFS(delta, (err) => {
      if (err) {
        emitter.emit('error', err)
        return
      }
      saving = null
      if (pending) {
        const delta = pending
        pending = null
        saveDelta(delta)
      }
    })
  }

  function saveToIPFS (delta, callback) {
    emitter.emit('saving', delta)
    console.log('saving to IPFS', delta)
    callback()
  }
}