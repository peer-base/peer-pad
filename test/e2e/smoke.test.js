/* global it afterEach expect */

import puppeteer from 'puppeteer'

let browsers = []

async function createBrowser () {
  const browser = await puppeteer.launch({headless: true})
  browsers.push(browser)
  return browser
}

afterEach(() => {
  browsers.forEach(b => b.close())
})

it('Renders without errors in the browser', async () => {
  const user = await createTabForUser('user')
  const errors = []
  user.on('error', err => errors.push(err))
  user.on('pageerror', err => errors.push(err))
  await createNewPad(user)
  const peerId = await findPeerId(user)
  console.log('peerId', peerId)
  expect(peerId).toBeTruthy()
  expect(peerId.length).toBeGreaterThan(10)
  expect(errors.length).toBe(0)
}, 30000)

it('synchronises two pads via ipfs', async (done) => {
  const alf = await createTabForUser('alf')
  await createNewPad(alf)
  const alfPeerId = await findPeerId(alf)
  expect(alfPeerId).toBeTruthy()
  const alfTitle = 'I R ROBOT'
  await alf.type('[data-id=document-title-input]', alfTitle)

  const bob = await createTabForUser('bob')
  console.log('pad url', alf.url())
  await bob.goto(alf.url())
  const bobPeerId = await findPeerId(bob)
  expect(bobPeerId).toBeTruthy()
  expect(bobPeerId).not.toEqual(alfPeerId)
  console.log('alf peerId', alfPeerId)
  console.log('bob peerId', bobPeerId)
  setTimeout(async () => {
    try {
      const bobTitle = await getDocumentTitle(bob)
      expect(bobTitle).toEqual(alfTitle)
    } catch (err) {
      done.fail(err)
    }
    done()
  }, 5000)
}, 3 * 60 * 1000)

async function getDocumentTitle (page) {
  await page.waitForSelector('[data-id=document-title-input]')
  const titleEl = await page.$('[data-id=document-title-input]')
  return page.evaluate(el => el.value, titleEl)
}

async function createNewPad (page) {
  await page.goto('http://localhost:3000')
  await page.waitForSelector('[data-id=start-button]')
  await page.click('[data-id=start-button]')
  await page.waitForSelector('[data-id=ipfs-status][data-value=online]')
  return page
}

async function findPeerId (page) {
  await page.waitForSelector('[data-peer-id]')
  const peersButton = await page.$('[data-peer-id]')
  const peerId = await page.evaluate(el => el.dataset.peerId, peersButton)
  return peerId
}

async function createTabForUser (username) {
  const browser = await createBrowser()
  const page = await browser.newPage()
  // page.on('console', msg => console.log(`${username} console:`, msg.text()))
  return page
}
