'use strict'

const { Cluster } = require('puppeteer-cluster');

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: 10,
  })

  let left = 10

  const bootstrap = async ({ page, data: url }) => {
    console.log(url)
    await page.goto(url)
    console.log('got')
    if ((--left) > 0) {
      console.log('queueing')
      cluster.queue('http://example.com/' + left, bootstrap)
    } else {
      (async () => {
        await cluster.idle()
        await cluster.close()
      })()
    }
  }


  await cluster.queue('http://example.com', bootstrap)
  // many more pages

})()
