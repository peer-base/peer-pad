import Diff from 'fast-diff'
import debounce from 'lodash.debounce'
import bindDebugDumper from './debug-dumper'

const DEBOUNCE_CUSOR_ACTIVITY_MS = 2000

const bindCodeMirror = (doc, titleEditor, editor) => {
  let cursorGossip
  let titleCollab
  let initialised = false
  let locked = false
  let editorValueCache

  const getEditorValue = () => {
    if (!editorValueCache) {
      editorValueCache = editor.getValue()
    }
    return editorValueCache
  }

  const applyDiffs = (pos, diffs) => {
    diffs.forEach((d) => {
      const [op, text] = d
      if (op === 0) { // EQUAL
        pos += text.length
      } else if (op === -1) { // DELETE
        for (let i = text.length - 1; i >= 0; i--) {
          try {
            doc.shared.removeAt(pos + i)
          } catch (err) {
            console.error(err)
            onStateChanged()
          }
        }
      } else { // INSERT
        doc.shared.insertAllAt(pos, text.split(''))
        pos += text.length
      }
    })
  }

  const onCodeMirrorChange = (editor) => {
    editorValueCache = undefined
    if (!initialised || locked) {
      return
    }
    const diffs = Diff(doc.shared.value().join(''), getEditorValue())
    applyDiffs(0, diffs)
  }

  editor.on('change', onCodeMirrorChange)

  const onStateChanged = () => {
    let oldText = getEditorValue()
    let newText = doc.shared.value().join('')

    if (oldText === newText) {
      return
    }

    locked = true

    const cursor = editor.getCursor()
    let cursorPos = editor.indexFromPos(cursor)

    const diffs = Diff(oldText, newText)
    let pos = 0
    editorValueCache = undefined

    diffs.forEach((d) => {
      const [op, text] = d
      if (op === 0) { // EQUAL
        pos += text.length
      } else if (op === -1) { // DELETE
        if (text.length) {
          const fromPos = editor.posFromIndex(pos)
          fromPos.external = true
          const toPos = editor.posFromIndex(pos + text.length)
          toPos.external = true
          editor.replaceRange('', fromPos, toPos)

          if (pos < cursorPos) {
            cursorPos -= text.length
          }
        }
      } else { // INSERT
        if (text.length) {
          const fromPos = editor.posFromIndex(pos)
          fromPos.external = true
          editor.replaceRange(text, fromPos)

          if (pos < cursorPos) {
            cursorPos += text.length
          }
          pos += text.length
        }
      }
    })

    locked = false
  }

  doc.shared.on('state changed', onStateChanged)

  editor.setValue(doc.shared.value().join(''))

  const onTitleStateChanged = () => {
    const oldTitle = titleEditor.value
    const newTitle = titleCollab.shared.value().join('')
    if (newTitle === oldTitle) {
      return
    }

    titleEditor.value = newTitle
  }

  doc.sub('title', 'rga').then((_titleCollab) => {
    titleCollab = _titleCollab
    titleCollab.on('state changed', onTitleStateChanged)
    const title = titleCollab.shared.value().join('')
    titleEditor.value = title
  })

  const onTitleEditorChanged = () => {
    if (!titleCollab) {
      return
    }

    const oldTitle = titleCollab.shared.value().join('')
    const newTitle = titleEditor.value

    const diffs = Diff(oldTitle, newTitle)

    let pos = 0
    diffs.forEach((d) => {
      if (d[0] === 0) { // EQUAL
        pos += d[1].length
      } else if (d[0] === -1) { // DELETE
        const delText = d[1]
        for (let i = delText.length - 1; i >= 0; i--) {
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
          pos++
        })
      }
    })
  }

  titleEditor.addEventListener('input', onTitleEditorChanged)

  doc.gossip('cursors').then((_cursorGossip) => {
    cursorGossip = _cursorGossip
  })

  const onEditorCursorActivity = () => {
    if (cursorGossip) {
      const cursor = [
        editor.getCursor('head'),
        editor.getCursor('from'),
        editor.getCursor('to')]
      cursorGossip.broadcast(cursor)
    }
  }

  const onEditorCursorActivityDebounced = debounce(onEditorCursorActivity, DEBOUNCE_CUSOR_ACTIVITY_MS)
  editor.on('cursorActivity', onEditorCursorActivityDebounced)

  initialised = true

  return () => {
    // unbind
    doc.removeListener('state changed', onStateChanged)
    editor.off('change', onCodeMirrorChange)
    titleEditor.removeEventListener('input', onTitleEditorChanged)
    if (titleCollab) {
      titleCollab.removeListener('state changed', onTitleStateChanged)
    }
    editor.off('cursorActivity', onEditorCursorActivityDebounced)
  }
}

export default (doc, title, editor, type) => {
  if (type === 'markdown' || type === 'math') {
    bindDebugDumper(doc)
    return bindCodeMirror(doc, title, editor)
  }

  throw new Error('unsupported type ' + type)
}
