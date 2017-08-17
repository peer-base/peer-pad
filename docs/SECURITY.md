# Peerpad Security

Peerpad is a decentralized editor that allows concurrent writing of text. Besides making live changes to a given document, it allows read-only nodes to follow the changes in real-time. It also allows you to publish a self-contained snapshot of the document to IPFS.

Below we describe the security model and take the opportunity to describe the underlying architecture in more detail.

## Security Model

Peerpad aims to be private. All data that is published into the network is encrypted and requires a key to decrypt. To participate in the real-time network of updates to a given document, the node must be in possession of the key. To read a snapshot, the reading node must also be in possession of a read key.

These keys are to be transmitted in the URL.

### Creating a document

Creating a document creates two keys: the read key and the write key. These keys make an asymetric key pair, which means that anything signed with the private key can be validated with the public key.

### Security: Real-time collaborative editing

To allow for concurrent real-time collaborative editing of a document, Peerpad uses a CRDT underneath, which, using the IPFS pubsub network, exchanges messages between nodes. These messages contain information about the operations and data being changes on the document.

These messages use the IPFS pubsub network, and are by nature ciphered in transit.

The name of the topic of the pubsub channel (AKA the room name) of these messages is a large portion of the read key, which makes it impossible to guess the topic name. Only in possession of the topic name will nodes get the CRDT messages.

These messages come signed with the __write key__, so that nodes in possession of the read key can validate the signature.

> The only exception to this are messages coming from read-only nodes (see later), but these nodes don't have CRDT write permission locally.

### Security: Real-time following

When only in possession of the read key, nodes can only follow in real-time. They get the CRDT messages but cannot follow. They can also send acknowledge messages to other nodes, but these messages are not signed (and don't need to be, since they don't convey any change to the document).

When a read-only node gets a message, it checks the signature against the read key, validating that the message issuer has write permissions and, if ok, passes that message to the CRDT.

### Security: Snapshotting

Participating nodes can also publish self-contained snapshots of the document. Before generating a snapshot, a new random key is generated and is used to encrypt the content. This encrypted content is then bundled with a simple JS application that decrypts and shows it.


### Security: local store

Peerpad uses the local store to store some records. These are the records that make up the CRDT and contain data and operations to the document. In order for this to be safe from people with access to the local store that don't have the key, these records are encrypted using a symmetric key derived from the "read key".

ATTENTION: THIS IS NOT IMPLEMENTED YET! CRDT records are stored locally in the clear, so anyone with access to the local store can extract the CRDT. [Track this issue here](https://github.com/ipfs-shipyard/peerpad/issues/4).