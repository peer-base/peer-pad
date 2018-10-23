'use strict'

module.exports = async ({page, worker, text, beforeWaitMS = 10000, sessionDurationMS = 20000, typeIntervalMS = 50, coolDownMS = 20000}) => {

  // // wait until everyone is onlube
  // const peersButton = await page.$('[data-peer-id]')
  // const peerId = await page.evaluate(el => el.dataset.peerId, peersButton)

  page.waitFor(beforeWaitMS)

  const editorSelector = '[class=CodeMirror-code][contenteditable=true]'
  const startedAt = Date.now()
  const endAt = startedAt + sessionDurationMS

  while (Date.now() < endAt) {
    await page.waitFor(typeIntervalMS)
    await page.type(editorSelector, text())
  }

  text.finished()
  await text.allDone()
  await page.waitFor(coolDownMS)
  const finalText = await page.evaluate(() => {
    return Promise.resolve(window.__peerPadEditor.getValue())
  })
  text.submitResult(finalText)
}

