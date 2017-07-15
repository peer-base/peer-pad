'use strict'

const EventEmitter = require('events')
const debounce = require('lodash.debounce')
const waterfall = require('async/waterfall')
const map = require('async/map')

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
    save: debounce(saveDoc, options.debounceMS, {
      maxWait: options.maxWaitMS
    })
  })

  return emitter

  function saveDoc(doc) {
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

    saveToIPFS(doc, (err, cid) => {
      if (err) {
        emitter.emit('error', err)
        return
      }
      saving = null
      emitter.emit('saved', cid)
      if (pending) {
        const doc = pending
        pending = null
        saveDoc(doc)
      }
    })
  }

  function saveToIPFS (docElements, callback) {
    emitter.emit('saving', docElements)

    waterfall(
      [
        (cb) => map(
          docElements,
          (docElem, callback) => {
            ipfs.dag.put(docElem, { format: 'dag-cbor' }, callback)
          },
          cb),
        (cids, cb) => cb(null, cids.map((cid) => cid.toBaseEncodedString())),
        (cids, cb) => {
          cb(null, {
            children: cids.map(cid => ({'/': cid}))
          })
        },
        (doc, cb) => {
          ipfs.dag.put(doc, { format: 'dag-cbor' }, cb)
        },
        (cid, cb) => {
          cb(null, cid.toBaseEncodedString())
        }
      ],
      callback)
  }
}