import pify from 'pify'
import { encode as b58Encode } from 'bs58'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { convert as convertMarkdown } from './markdown'

const version = require('../../package.json').version

export default async (keys, doc, options) => {
  let docText = doc.shared.value().join('')
  docText = await convertMarkdown(docText, options.type)
  docText = Buffer.from(docText)

  const key = await keys.generateSymmetrical()
  const encrypt = pify(key.key.encrypt.bind(key.key))
  const html = htmlForDoc(await encrypt(docText), options.docScript, options.DocViewer)
  const title = (await doc.sub('title', 'rga')).shared.value().join('')

  const files = [
    {
      path: './meta.json',
      content: Buffer.from(JSON.stringify({
        type: options.type,
        name: title,
        version
      }, null, '\t'))
    },
    {
      path: './index.html',
      content: html
    }
  ]

  const stream = doc.app.ipfs.files.addReadableStream()
  return new Promise((resolve, reject) => {
    stream.once('error', (err) => reject(err))
    stream.on('data', (node) => {
      if (node.path === '.') {
        resolve({
          key: b58Encode(key.raw),
          hash: node.hash
        })
      }
    })
    files.forEach((file) => stream.write(file))
    stream.end()
  })
}

function htmlForDoc (encryptedDoc, docScript, DocViewer) {
  const doc = '<!doctype html>\n' +
    renderToString(React.createElement(DocViewer, {
      encryptedDoc,
      docScript
    }))

  return Buffer.from(doc)
}
