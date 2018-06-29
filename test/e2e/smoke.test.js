'use strict'

/* global expect */
/* eslint-env mocha */

import ms from 'milliseconds'
import {createPage, createNewPad, waitForPeerId, cleanup} from './utils'

afterEach(() => cleanup())

it('creates a pad', async () => {
  const page = await createPage()

  // Create a pad and wait for IPFS to init.
  await createNewPad(page)
  const peerId = await waitForPeerId(page)
  console.log('peerId', peerId)

  expect(peerId).toBeTruthy()
  expect(peerId.length).toBeGreaterThan(10)
  page.expectNoError()
}, ms.minutes(3))

it('synchronises two pads via IPFS', async () => {
  const docTitleSelector = '[data-id=document-title-input]'

  const alf = await createPage()
  await createNewPad(alf)
  const alfPeerId = await waitForPeerId(alf)
  console.log('alf peerId', alfPeerId)
  expect(alfPeerId).toBeTruthy()
  const alfTitle = 'I R ROBOT'
  await alf.type(docTitleSelector, alfTitle)
  const padUrl = alf.url()
  console.log('pad url', padUrl)

  const bob = await createPage()
  await bob.goto(padUrl)
  const bobPeerId = await waitForPeerId(bob)
  expect(bobPeerId).toBeTruthy()
  expect(bobPeerId).not.toEqual(alfPeerId)
  console.log('bob peerId', bobPeerId)

  bob.expectNoError()
  alf.expectNoError()

  // Wait for bob's doc title to match alf's
  const bobTitleRef = await bob.$(docTitleSelector)
  const valueMatches = (input, expected) => input.value === expected
  // waitFor fn is executed in the browser context, so context has to be passed as arg.
  await bob.waitFor(valueMatches, {/* opts */}, bobTitleRef, alfTitle)
}, ms.minutes(6)) // spinning up 2 browsers and syncing pads can take a while.
