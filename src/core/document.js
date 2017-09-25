const EventEmitter = require('events')

class Document extends EventEmitter {
  constructor (options, backend) {
    super()
    this._options = options
    this._backend = backend
  }

  bindEditor (editor) {
    if (this._options.type === 'richtext') {
      this._backend.crdt.share.richtext.bindQuill(editor)
    } else {
      // TODO
    }
  }

  unbindEditor (editor) {
    if (this._options.type === 'richtext') {
      this._backend.crdt.share.richtext.unbindQuill(editor)
    } else {
      // TODO
    }
  }
}

export default Document
