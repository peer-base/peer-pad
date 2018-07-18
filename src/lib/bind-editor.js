import Diff from 'fast-diff'

const bindCodeMirror = (doc, editor) => {
  let initialised = false

  const onCodeMirrorChange = (editor, change) => {
    if (!initialised) {
      return
    }

    const diffs = Diff(doc.shared.value().join(''), editor.getValue())

    let pos = 0
    diffs.forEach((d) => {
      if (d[0] === 0) { // EQUAL
        pos += d[1].length
      } else if (d[0] === -1) { // DELETE
        const delText = d[1]
        for (let i = delText.length - 1; i >=0; i--) {
          doc.shared.removeAt(pos + i)
        }
      } else { // INSERT
        d[1].split('').forEach((c) => {
          doc.shared.insertAt(pos, d[1])
        })
        pos += d[1].length
      }
    })

    // const index = editor.indexFromPos(change.from)
    // if (change.removed.length) {
    //   change.removed.forEach((removed) => {
    //     if (removed.length) {
    //       for(let i = removed.length - 1; i >=0; i--) {
    //         doc.shared.removeAt(i + index)
    //       }
    //     }
    //   })
    //   change.text.forEach((text) => {
    //     text.split('').forEach((added, pos) => {
    //       doc.shared.insertAt(index + pos, added)
    //     })
    //   })
    // }
  }

  editor.on('change', onCodeMirrorChange)

  const onStateChanged = () => {
    const oldText = editor.getValue()
    const newText = doc.shared.value().join('')

    if (oldText !== newText) {
      editor.setValue(newText)
    }
  }

  doc.on('state changed', onStateChanged)

  editor.setValue(doc.shared.value().join(''))

  initialised = true

  return () => {
    // unbind
    doc.removeListener('state changed', onStateChanged)
    editor.off('change', onCodeMirrorChange)
  }
}

export default (doc, editor, type) => {
  if (type === 'markdown') {
    return bindCodeMirror(doc, editor)
  }

  throw new Error('unsupported type ' + type)
}

