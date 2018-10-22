'use strict'

module.exports = ({events}) => async ({ page, data: url, worker }) => {
  await page.goto(url)
  page.on('console', (m) => events.emit('message', `[worker ${worker.id}]: ${m.text()}`))
}