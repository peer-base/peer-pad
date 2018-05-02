/* global it beforeAll afterAll expect */

import puppeteer from 'puppeteer'

let browser = null

// depends on a url that'll serve the app.

beforeAll(async () => {
  browser = await puppeteer.launch({headless: false, sloMo: 50})
})

afterAll(() => {
  browser.close()
})

it('Renders without errors in the browser', async (done) => {
  const user = await createTabForUser('user')
  const errors = []
  user.on('error', err => errors.push(err))
  user.on('pageerror', err => errors.push(err))
  await createNewPad(user)
  const peerId = findPeerId(user)
  console.log('peerId', peerId)
  expect(peerId.length).toBeGreaterThan(10)
  expect(errors.length).toBe(0)
})

it('synchronises two pads via ipfs', async (done) => {
  const alf = await createTabForUser('alf')
  await createNewPad(alf)
  const alfTitle = 'I R ROBOT'
  await alf.type('[data-id=document-title-input]', alfTitle)

  const bob = await createTabForUser('bob')
  await bob.goto(alf.url())
  setTimeout(async () => {
    const bobTitle = await getDocumentTitle(bob)
    expect(bobTitle).toEqual(alfTitle)
    done()
  }, 10000)
}, 60000)

async function getDocumentTitle (page) {
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
  const page = await browser.newPage()
  // page.on('console', msg => console.log(`${username} console:`, msg.text()))
  return page
}
