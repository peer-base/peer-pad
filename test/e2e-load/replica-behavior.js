'use strict'

module.exports = async ({page, worker, text, beforeWaitMS = 10000, sessionDurationMS = 40000, typeIntervalMS = 50, coolDownMS = 20000}) => {

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
  console.log('FINISHED')

  await text.allDone()
  console.log('ALL DONE')

  console.log('cooling down...')
  await page.waitFor(coolDownMS)
  console.log('colled down.')

  // const editor = await page.$(editorSelector)
  // const content = await editor.toString()
  // console.log('content:', content)

  await page.waitFor(1000)
  await page.waitFor(1000)
  console.log(`${worker.id} waited 1000`)
  const finalText = await page.evaluate(() => {
    return Promise.resolve(window.__peerPadEditor.getValue())
  })
  console.log(`text in ${worker.id}: ${finalText}`)
  text.submitResult(finalText)
}

