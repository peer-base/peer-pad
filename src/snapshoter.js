import EventEmitter from 'events'
import waterfall from 'async/waterfall'

export default (ipfs, cipher) => {
  let saving = null
  let pending = null

  const emitter = new EventEmitter()
  emitter.save = saveDoc

  return emitter

  function saveDoc (doc) {
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
    const clear = Buffer.from(doc)

    waterfall([
      (callback) => cipher(callback),
      (cipher, callback) => cipher.encrypt(clear, callback),
      (ciphered, callback) => ipfs.files.add(ciphered, callback),
      (resArray, callback) => callback(null, resArray[resArray.length - 1])
    ], callback)
  }
}
