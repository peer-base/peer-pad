'use strict'

module.exports = async ({page, worker, text, beforeWaitMS = 10000, sessionDurationMS = 30000, typeIntervalMS = 50, coolDownMS = 120000}) => {
  page.waitFor(beforeWaitMS)

  const editorSelector = '[class=CodeMirror-code][contenteditable=true]'
  const startedAt = Date.now()
  const endAt = startedAt + sessionDurationMS

  while (Date.now() < endAt) {
    if (Math.random() < 0.1) {
      await page.waitFor(4000)
    } else {
      await page.waitFor(typeIntervalMS)
    }

    await page.type(editorSelector, text())
  }

  text.finished()
  await text.allDone()
  await page.waitFor(coolDownMS)
  const finalText = await page.evaluate(() => {
    return window.__peerPadEditor.getValue()
  })
  text.submitResult(finalText)
}
