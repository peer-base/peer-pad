import Diff from 'fast-diff'
import debounce from 'lodash.debounce'
import peerColor from './peer-color'
import functionQueue from './fn-queue'

const DEBOUNCE_CUSOR_ACTIVITY_MS = 2000

const bindCodeMirror = (doc, titleEditor, editor) => {
  const thisPeerId = doc.app.ipfs._peerInfo.id.toB58String()
  let cursorGossip
  let titleCollab
  let initialised = false
  let locked = false
  let markers = new Map()
  let queue = functionQueue()

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

  const onCodeMirrorChange = debounce((editor) => {
    queue.push(() => {
      if (!initialised || locked) {
        return
      }
      const diffs = Diff(doc.shared.value().join(''), editor.getValue())
      applyDiffs(0, diffs)
    })
  })

  editor.on('change', debounce(onCodeMirrorChange, 1000))

  const onStateChanged = (fromSelf) => {
    if (fromSelf) {
      return
    }
    queue.push(() => {
      let oldText = editor.getValue()
      let newText = doc.shared.value().join('')

      if (oldText === newText) {
        return
      }

      locked = true

      const cursor = editor.getCursor()
      let cursorPos = editor.indexFromPos(cursor)

      const diffs = Diff(oldText, newText)
      let pos = 0
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

            moveMarkersIfAfter(pos, -text.length)
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
            moveMarkersIfAfter(pos, text.length)
          }
        }
      })
      editor.setCursor(editor.posFromIndex(cursorPos))

      oldText = editor.getValue()
      newText = doc.shared.value().join('')

      locked = false

      if (oldText !== newText) {
        onStateChanged()
      }
    })
  }

  doc.on('state changed', onStateChanged)

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

  const onCursorGossipMessage = (cursor, fromPeerId) => {
    if (fromPeerId === thisPeerId) {
      return
    }

    const previousMarkers = markers.get(fromPeerId)
    if (previousMarkers) {
      previousMarkers.forEach((marker) => marker.clear())
    }

    const color = peerColor(fromPeerId)

    const [head, fromPos, toPos] = cursor

    const widget = getCursorWidget(head, color)

    const bookmark = editor.setBookmark(head, { widget })
    const range = editor.markText(fromPos, toPos, {
      css: `background-color: ${color}; opacity: 0.8`,
      title: fromPeerId
    })
    markers.set(fromPeerId, [bookmark, range])
  }

  doc.gossip('cursors').then((_cursorGossip) => {
    cursorGossip = _cursorGossip
    cursorGossip.on('message', onCursorGossipMessage)
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
    if (cursorGossip) {
      cursorGossip.removeListener('message', onCursorGossipMessage)
    }
  }

  function getCursorWidget (cursorPos, color) {
    const cursorCoords = editor.cursorCoords(cursorPos)
    const cursorElement = document.createElement('span')
    cursorElement.style.borderLeftStyle = 'solid'
    cursorElement.style.borderLeftWidth = '2px'
    cursorElement.style.borderLeftColor = color
    cursorElement.style.height = `${(cursorCoords.bottom - cursorCoords.top)}px`
    cursorElement.style.padding = 0
    cursorElement.style.zIndex = 0

    return cursorElement
  }

  function moveMarkersIfAfter (pos, diff) {
    for (let peer of markers.keys()) {
      const peerMarkers = markers.get(peer)
      moveMarkerIfAfter(peer, peerMarkers, pos, diff)
    }
  }

  function moveMarkerIfAfter (peer, peerMarkers, changePos, diff) {
    peerMarkers.forEach((marker, index) => {
      const markerPos = marker.find()
      if (markerPos) {
        const posIndex = editor.indexFromPos(markerPos)
        if (posIndex >= changePos) {
          marker.clear()
        }
      } else {
        marker.clear()
      }
    })

    markers.delete(peer)
  }

//   function moveMarkerIfAfterBuggy (peer, peerMarkers, changePos, diff) {
//     let pos
//     let posIndex
//     let newMarkers = []
//     peerMarkers.forEach((marker, index) => {
//       const markerPos = marker.find()
//       if (markerPos) {
//         console.log('marker:', marker)
//         pos = markerPos
//         posIndex = editor.indexFromPos(pos)
//         if (posIndex >= changePos) {
//           peerMarkers.splice(index, 1)
//           marker.clear()
//           posIndex += diff
//           const newPos = editor.posFromIndex(posIndex)
//           const color = peerColor(peer)
//           const widget = getCursorWidget(newPos, color)
//           const bookmark = editor.setBookmark(newPos, { widget })
//           newMarkers.push(bookmark)
//         }
//       } else {
//         newMarkers.push(marker)
//       }
//     })

//     markers.set(peer, newMarkers)
//   }
}

export default (doc, title, editor, type) => {
  if (type === 'markdown' || type === 'math') {
    return bindCodeMirror(doc, title, editor)
  }

  throw new Error('unsupported type ' + type)
}
