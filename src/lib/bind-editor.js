import Diff from 'fast-diff'

const bindCodeMirror = (doc, titleEditor, editor) => {
  let initialised = false
  let titleCollab
  let editorLocked = false

  console.log('titleEditor:', titleEditor.addListener)

  const onCodeMirrorChange = (editor, change) => {
    if (!initialised) {
      return
    }

    if (editorLocked) {
      return
    }

    editorLocked = true

    const diffs = Diff(doc.shared.value().join(''), editor.getValue())

    let pos = 0
    diffs.forEach((d) => {
      if (d[0] === 0) { // EQUAL
        pos += d[1].length
      } else if (d[0] === -1) { // DELETE
        const delText = d[1]
        for (let i = delText.length - 1; i >=0; i--) {
          try {
            doc.shared.removeAt(pos + i)
          } catch (err) {
            console.error(err)
            onStateChanged()
          }
        }
      } else { // INSERT
        d[1].split('').forEach((c) => {
          doc.shared.insertAt(pos, c)
          pos ++
        })
      }
    })

    editorLocked = false
  }

  editor.on('change', onCodeMirrorChange)

  const onStateChanged = () => {
    if (editorLocked) {
      return
    }

    const oldText = editor.getValue()
    const newText = doc.shared.value().join('')

    if (oldText === newText) {
      return
    }
    editorLocked = true

    const cursor = editor.getCursor()
    const originalCursorPos = editor.indexFromPos(cursor)
    let cursorPos = originalCursorPos

    const diffs = Diff(oldText, newText)
    let pos = 0
    diffs.forEach((d) => {
      const text = d[1]
      if (d[0] === 0) { // EQUAL
        pos += d[1].length
      } else if (d[0] === -1) { // DELETE
        if (text.length) {
          const fromPos = editor.posFromIndex(pos)
          const toPos = editor.posFromIndex(pos + text.length)
          editor.replaceRange('', fromPos, toPos)

          if (pos < cursorPos) {
            cursorPos -= d[1].length
          }
        }
      } else { // INSERT
        if (text.length) {
          const fromPos = editor.posFromIndex(pos)
          editor.replaceRange(d[1], fromPos)

          if (pos < cursorPos) {
            cursorPos += d[1].length
          }

          pos += d[1].length
        }
      }
    })
    if (originalCursorPos !== cursorPos) {
      editor.setCursor(editor.posFromIndex(cursorPos))
    }
    editorLocked = false
  }

  doc.on('state changed', onStateChanged)

  editor.setValue(doc.shared.value().join(''))

  const onTitleStateChanged = () => {
    const oldTitle = titleEditor.value
    const newTitle = titleCollab.shared.value().join('')
    console.log('title changed to', newTitle)
    if (newTitle === oldTitle) {
      return
    }

    titleEditor.value = newTitle
  }

  doc.sub('title', 'rga').then((_titleCollab) => {
    titleCollab = _titleCollab
    titleCollab.on('state changed', onTitleStateChanged)
    const title = titleCollab.shared.value().join('')
    console.log('initial title is', title)
    titleEditor.value = title
  })

  const onTitleEditorChanged = () => {
    if (!titleCollab) {
      return
    }

    const oldTitle = titleCollab.shared.value().join('')
    const newTitle = titleEditor.value

    console.log('old title:', oldTitle)
    console.log('new title:', newTitle)

    const diffs = Diff(oldTitle, newTitle)
    console.log('diffs:', diffs)

    let pos = 0
    diffs.forEach((d) => {
      if (d[0] === 0) { // EQUAL
        pos += d[1].length
      } else if (d[0] === -1) { // DELETE
        const delText = d[1]
        for (let i = delText.length - 1; i >=0; i--) {
          try {
            titleCollab.shared.removeAt(pos + i)
          } catch (err) {
            console.error(err)
            onStateChanged()
          }
        }
      } else { // INSERT
        d[1].split('').forEach((c) => {
          titleCollab.shared.insertAt(pos, c)
          pos ++
        })
      }
    })
  }

  titleEditor.addEventListener('input', onTitleEditorChanged)

  initialised = true

  return () => {
    // unbind
    doc.removeListener('state changed', onStateChanged)
    editor.off('change', onCodeMirrorChange)
    titleEditor.removeEventListener('input', onTitleEditorChanged)
    if (titleCollab) {
      titleCollab.removeListener('state changed', onTitleStateChanged)
    }
  }
}

export default (doc, title, editor, type) => {
  if (type === 'markdown') {
    return bindCodeMirror(doc, title, editor)
  }

  throw new Error('unsupported type ' + type)
}

