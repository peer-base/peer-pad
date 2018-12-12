import { encode } from 'delta-crdts-msgpack-codec'

export default function bindDebugDumper (doc) {
  if (!window.peerPadDevTools) window.peerPadDevTools = {}
  const tools = window.peerPadDevTools
  tools.doc = doc
  tools.dumpState = function dumpState () {
    console.log('State:', doc.shared.state())
    console.log('State (Base64):', encode(doc.shared.state()).toString('base64'))
  }
}
