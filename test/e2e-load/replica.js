'use strict'

module.exports = async ({ page, data: url }) => {
  console.log(url)
  await page.goto(url)
  console.log('got')
}