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
  readKey: 'gobelegook',
  writeKey: 'moregobelegook'
}

const peerpad = Peerpad(options)
```

## `options`:

* `name`: string that uniquely identifies this
* `readKey`: b58-encoded string or buffer that contains the read key
* `writeKey`: b58-encoded string or buffer that contains the write key (optional)


## `peerpad.peers`

### `peerpad.peers.all()`

Returns an array of peers:

```js
peerpad.peers.all()
// returns:
[
  {
    id: 'QmHashHash1',
    person: {
      // attributes from http://schema.org/Person
    },
    permissions: {
      admin: false,
      write: true,
      read: true
    }
  },
  {
    id: 'QmHashHash2',
    person: {
      // attributes from http://schema.org/Person
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

## `peerpad.network`

Exposes some IPFS network statistics. TODO

## `peerpad.document`

### `peerpad.document.bind(editor)`

Two-way bind to a [Quill](https://quilljs.com) editor. Example:

```js
import Quill from 'quill'

const editor = new Quill('#editor')

peerpad.document.bind(editor)
```

### `peerpad.document.unbind(editor)`

### `peerpad.document.on('change', fn)`

Emitted when the document changes. `fn` is called with the arguments:

* `peer` (a Peer object)
* `delta` a [Quill-Delta](https://github.com/quilljs/delta/#readme)


## `peerpad.attachments`

### `peerpad.attachments.add(file[, progressFn])`

Adds a file.

Returns a promise, which resolves to the IPFS hash of the file. The file is encrypted using the read key before being stored in IPFS.

If `progressFn` is passed in, progress is reported every now and then by calling it with one argument, a number from 0 to 1. A value of 1 denotes that the file has completed uploading.


## `peerpad.history`

### `peerpad.history.all()`

Returns the entire history of this document as an array of History objects.


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
  person: {
    // attributes from http://schema.org/Person
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
  delta: delta, // of type Delta
  peer: {
    id: 'QmHashHash1',
    person: {
      // attributes from http://schema.org/Person
    },
    permissions: {
      admin: false,
      write: true,
      read: true
    }
  }
}
```