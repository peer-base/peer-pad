'use strict'

const delay = require('delay')

module.exports = async ({page, text, sessionDurationMS = 20000, typeIntervalMS = 100, coolDownMS = 60000}) => {
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

  await page.waitFor(coolDownMS)
}

