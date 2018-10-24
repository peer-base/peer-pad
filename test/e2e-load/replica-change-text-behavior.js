'use strict'

module.exports = async ({page, worker, text, beforeWaitMS = 10000, sessionDurationMS = 20000, typeIntervalMS = 50, coolDownMS = 40000}) => {

  const startedAt = Date.now()
  const endAt = startedAt + sessionDurationMS

  while (Date.now() < endAt) {
    const removal = text.randomChar()
    const [pos, char] = removal
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
      text.addRemoval(removal)
    }
    text.setCurrent(currentText)

    await page.waitFor(typeIntervalMS)
  }
}
