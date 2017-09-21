# Peerpad core API

## Install

```bash
$ npm install peerpad-core --save
```

## Import

```js
import Peerpad from 'peerpad-core'
```

## `Peerpad(options)`

Creates a Peerpad

```js
const options = {
  name: 'name of the pad',
  type: 'richtext',
  readKey: 'gobelegook',
  writeKey: 'moregobelegook'
}

const peerpad = Peerpad(options)
```

## `options`:

* `name`: string that uniquely identifies this
* `type`: string that identifies type of document. Currently supports `text` or `richtext`.
* `readKey`: b58-encoded string or buffer that contains the read key
* `writeKey`: b58-encoded string or buffer that contains the write key (optional)
* `produceSignature`: a function you supply that produces a signature for a given blob. See the section "Authentication" further down.
* `validateSignature`: a function you supply that produces a signature for a given blob. See the section "Authentication" further down.
* `ipfs`: IPFS node that is already created (optional)


## Authentication: `peerpad.auth`

### `peerpad.auth.setCredential(credential)`

Sets the current user credential.

* `credential`: a JSON-encodable object that represents the current user credential.

### Signatures

The constructor options accept a function to produce a signature and another to validate a signature.

#### `options.produceSignature`

This function accepts two arguments: the first is a credential of the current user (if set through `peerpad.auth.setCredential(credential)`) and the second is a buffer to sign. It should return a promise that resolves to a buffer containing the signature.

Example:

```js
function produceSignature(credential, message) {
  return new Promise((resolve, reject) => {
    signMessageSomehow(message, (err, signature) => {
      if (err) {
        return reject(err)
      }
      resolve(signature)
    })
  })
}
```

#### `options.validateSignature`

Function provided to validate a signature of a remote message.

This function accepts three arguments: the first is a credential of the remote user (if set), the second is the message to sign (a buffer) and the third is a singature (buffer). It should return a promise that resolves if the signature is valid and rejects if it's not.

Example:

```js
function validateSignature(credential, message, signature) {
  return new Promise((resolve, reject) => {
    validateSignatureSomehow(message, signature (err, isValid) => {
      if (err || !isValid) {
        return reject(err)
      }
      resolve()
    })
  })
}
```

## Access Control: `peerpad.access`

### `peerpad.access.add(peerId, permission)`

Give permission to peer. Arguments:

* `peerId`: string representing the peer.
* `permission` (string): can be `read`, `write` or `admin`


### `peerpad.access.remove(peerId, permission)`

Remove permission to peer. Arguments:

* `peerId`: string representing the peer.
* `permission` (string): can be `read`, `write` or `admin`


### `peerpad.access.get(peerId)`

Gets access for given peer. Returns array of permissions (strings), each of which can be `read`, `write` or `admin`.


## Peers: `peerpad.peers`

### `peerpad.peers.all()`

Returns an array of peers:

```js
peerpad.peers.all()
// returns:
[
  {
    id: 'QmHashHash1',
    credential: {
      // an arbitrary JSON-encodable object
    },
    permissions: {
      admin: false,
      write: true,
      read: true
    }
  },
  {
    id: 'QmHashHash2',
    credential: {
      // // an arbitrary JSON-encodable object
    },
    permissions: {
      admin: false,
      write: false,
      read: true
    }
  }
]
```

### `peerpad.peers.on('change', fn)`

Emitted when there is a change in the peer list:

```js
peerpad.peers.on('change', () => {
  console.log('peers changed and now are', peerpad.peers.all())
})
```

## Network: `peerpad.network`

Exposes some IPFS network statistics.

## Document: `peerpad.document`

### `peerpad.document.bindEditor(editor)`

Bind [CodeMirror](https://codemirror.net) editor (for pad of type `text`) or [Quill](https://quilljs.com) editor (for pad of type `richtext`).

Two-way bind to a  editor. Example for Quill:

```js
import Quill from 'quill'

const editor = new Quill('#editor')

peerpad.document.bindEditor(editor)
```

Example for CodeMirror:

```js
import Codemirror from 'codemirror'

const editor = CodeMirror.fromTextArea(myTextArea)

peerpad.document.bindEditor(editor)
```

### `peerpad.document.unbindEditor(editor)`

Unbinds editor.

### `peerpad.document.on('change', fn)`

Emitted when the document changes. `fn` is called with the arguments:

* `peer` (a Peer object)
* `operation` (object of type Operation, see further down)

## `peerpad.attachments`

### `peerpad.attachments.add(file[, progressFn])`

Adds a file.

Returns a promise, which resolves to the IPFS hash of the file. The file is encrypted using the read key before being stored in IPFS.

If `progressFn` is passed in, progress is reported every now and then by calling it with one argument, a number from 0 to 1. A value of 1 denotes that the file has completed uploading.


## `peerpad.history`

### `peerpad.history.all()`

Returns the entire history of this document as an array of History objects.

### `peerpad.history.allFor(peerId)`

Returns the entire history of edits for a given peer, identified by peerId (string).


## `peerpad.snapshots`

## `peerpad.snapshots.take()`

Returns a promise

```js
peerpad.snapshots.take().then((hash) => {
  console.log('snapshot hash: ', hash)
})
```

## Types

### Peer

```
{
  id: 'QmHashHash1',
  credential: {
    // an arbitrary JSON-encodable object
  },
  permissions: {
    admin: false,
    write: true,
    read: true
  }
}
```

### History

```
{
  when: date, // of type Date
  operation: {...}, // of type Operation
  peer: {...} // of type Peer
}
```

### Operation

Describes an operation. An operation can be an insertion or a deletion at a given position. This position can either be:

* the character position for type `text`
* the delta position for type `richtext`

Has the following attributes:

* `type`: can be `insert` or `delete`
* `position`: integer representing the operation position
* `values`: can an array of strings (for a pad of type `text`) or an array of [Deltas](https://github.com/quilljs/delta) (for a pad of type `richtext`)
* `length`: integer, representing the amount of operations inserted or deleted
