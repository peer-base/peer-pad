import { Buffer } from 'safe-buffer'
import DeltaToHTML from 'quill-delta-to-html'

class Snapshots {
  constructor (options, backend) {
    this._options = options
    this._backend = backend
  }

  async take () {
    let doc
    if (this._options.type === 'richtext') {
      const delta = this._backend.crdt.share.richtext.toDelta()
      const converter = new DeltaToHTML(delta, {})
      doc = Buffer.from(converter.convert())
    } else {
      // TODO: other types
    }

    if (doc) {
      return await this._backend.ipfs.files.add(doc).then((results) =>
        results[results.length - 1].hash)
    }
  }
}

export default Snapshots
