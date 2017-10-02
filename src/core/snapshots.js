import { Buffer } from 'safe-buffer'
import DeltaToHTML from 'quill-delta-to-html'
import pify from 'pify'
import { encode as b58Encode } from 'bs58'
import React from 'react'
import { renderToString } from 'react-dom/server'

import Doc from './templates/Doc'

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
      console.log(doc)
    } else {
      // TODO: other types
    }

    if (doc) {
      const key = await this._backend.keys.generateSymmetrical()
      const encrypt = pify(key.key.encrypt.bind(key.key))
      const html = await htmlForDoc(await encrypt(doc))
      return await this._backend.ipfs.files.add(html).then((results) => (
        {
          key: b58Encode(key.raw),
          hash: results[results.length - 1].hash
        }))
    }
  }
}

export default Snapshots

async function htmlForDoc (encryptedDoc) {
  return Buffer.from('<!doctype html>' + renderToString(React.createElement(Doc, { encryptedDoc })))
}