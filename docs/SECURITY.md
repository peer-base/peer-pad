# PeerPad Security

# 🔓 PeerPad is experimental software. It hasn't been audited, and as such shouldn't be used to create or share sensitive information.

PeerPad is a decentralized editor that allows concurrent writing of text. Besides making live changes to a given document, it allows read-only nodes to follow the changes in real-time. It also allows you to publish a self-contained snapshot of the document to IPFS.

Below we describe the security model and take the opportunity to describe the underlying architecture in more detail.

## Security Model

PeerPad aims to be private. All data that is published into the network is encrypted and requires a key to decrypt. To participate in the real-time network of updates to a given document, the node must be in possession of the key. To read a snapshot, the reading node must also be in possession of a read key.

These keys are to be transmitted in the URL in a way that no server gets them (through the hash portion of the URL).

### Creating a document

When creating a document, two keys are created: the read key and the write key. These keys make an asymetric key pair, which means that anything signed with the private key can be validated with the public key. Nodes that have the write keys sign the operation messages using it. All nodes detaining the read key can validate the message signature and apply the respective operations if it checks out.

### Security: Real-time collaborative editing

To allow for concurrent real-time collaborative editing of a document, PeerPad uses a CRDT underneath, which, using the IPFS pubsub network, exchanges messages between nodes. These messages contain information about the operations and data being changes on the document.

These messages use the IPFS pubsub network, and are by nature ciphered in transit.


### Networking privacy

For privacy, these messages are encrypted using the read key, and then decrypted upon reception by a node containing the read key. A node that, knowing the pub-sub channel, listens to the messages, still can't decrypt them without the read key.


### Non-repudiation of a node in possession of the write key

These messages come signed with the __write key__, so that nodes in possession of the read key can validate the signature.

Upon reception, a node can validate the signature using the read key, thus validating that the message came from a node containing the write key.

> The only exception to this are messages coming from read-only nodes (see later), but these nodes don't have CRDT write permission locally.


### User authentication and non-repudiation

Each message should come wrapped with the origin user identifier and a signature of the message. Upon reception, the node:

* validates that the current has the right to send such a message
* retrieves the user public key
* validates the message signature

Should any of these steps fail, the node should ignore the message.


### Real-time following by read-only nodes

When only in possession of the read key, nodes can only follow in real-time. They get the CRDT messages but cannot follow. They can also send acknowledge messages to other nodes, but these messages are not signed (and don't need to be, since they don't convey any change to the document).

When a read-only node gets a message, it checks the signature against the read key, validating that the message issuer has write permissions and, if ok, passes that message to the CRDT.


### Snapshotting

Participating nodes can also publish self-contained snapshots of the document. Before generating a snapshot, a new random key is generated and is used to encrypt the content. This encrypted content is then bundled with a simple JS application that decrypts and shows it.


### Security of data at rest

PeerPad uses the local store to store some records. These are the records that make up the CRDT and contain data and operations to the document. In order for this to be safe from people with access to the local store that don't have the key, these records are encrypted using a symmetric key derived from the "read key".
