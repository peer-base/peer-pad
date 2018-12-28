'use strict'

module.exports = async ({page, worker, text, beforeWaitMS = 10000, sessionDurationMS = 20000, typeIntervalMS = 50, coolDownMS = 120000}) => {
  const startedAt = Date.now()
  const endAt = startedAt + sessionDurationMS
  let insertOp = false

  while (Date.now() < endAt) {
    if (insertOp) {
      await insert()
    } else {
      await remove()
    }

    insertOp = !insertOp

    if (Math.random() < 0.05) {
      await page.waitFor(4000)
    } else {
      await page.waitFor(typeIntervalMS)
    }
  }

  await page.waitFor(coolDownMS)
  const finalText = await page.evaluate(() => {
    return window.__peerPadEditor.getValue()
  })

  text.setFinal(finalText)

  async function insert () {
    const [pos, char] = text.randomNewChar()
    const [added, currentText] = await page.evaluate((pos, char) => {
      const editor = window.__peerPadEditor
      if (editor.getValue().length < pos) {
        return [false, editor.getValue()]
      } else {
        const fromPos = editor.posFromIndex(pos)
        editor.replaceRange(char, fromPos)
        return [true, editor.getValue()]
      }
    }, pos, char)

    if (added) {
      text.addOp(['+', pos, char])
    }
    text.setCurrent(currentText)
  }

  async function remove () {
    const [pos, char] = text.randomRemovableChar()
    const [removed, currentText] = await page.evaluate((pos, char) => {
      const editor = window.__peerPadEditor
      const text = editor.getValue()
      const ch = text.charAt(pos)
      if (ch !== char) {
        return [false, editor.getValue()]
      } else {
        const fromPos = editor.posFromIndex(pos)
        const toPos = editor.posFromIndex(pos + 1)
        editor.replaceRange('', fromPos, toPos)
        return [true, editor.getValue()]
      }
    }, pos, char)

    if (removed) {
      text.addOp(['-', pos, char])
    }
    text.setCurrent(currentText)
  }
}
