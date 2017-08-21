# Peerpad Architecture

Peerpad is a decentralized editor that allows concurrent writing of text. Besides making live changes to a given document, it allows read-only nodes to follow the changes in real-time. It also allows you to publish a self-contained snapshot of the document to IPFS.

## Environment


    ┌─────────┐                 ┌─────────┐
    │         │                 │         │
    │ Peerpad │                 │ Peerpad │
    │  Node   │◀───────────────▶│  Node   │
    │         │                 │         │
    └─────────┘                 └─────────┘
         ▲                           ▲
         │                           │
         │                           │
         │                           │
         │                           │
         │        ┌─────────┐        │
         │        │         │        │
         │        │ Peerpad │        │
         └───────▶│  Node   │◀───────┘
                  │         │
                  └─────────┘


Peerpad nodes are self-contained, they live in a browser and don't need any other type of node to go about their business. They connect to each other without any intermediary, exchanging messages directly in peer-to-peer style.

A peerpad node runs solely on a modern browser. It uses some of the available transports and abstractions provided by IPFS to connect the participating nodes, allowing nodes to watch or even collaborate between them by exchanging messages.

Peerpad also leverages IPFS file storage to be able to publish snapshots of a document.

                         ┌───────────────────────────────────────────────────────────────┐
                         │Peerpad Document                                               │
                         │                                                               │
                         │┌──────────┐┌───────────┐                                      │
                         ││ read key ││ write key │                                      │
                         │└──────────┘└───────────┘                                      │
                         │           ┌──────────────────────────────────────┐            │
                         │ ┌─────────┼──────────────────────────────────────┼───────────┐│
                         │ │UI       ▼                                      │           ││
                         │ │   ┌───────────┐   ┌───────────────┐┌──────────────────────┐││
                         │ │   │           │   │               ││                      │││
                         │ │   │           │   │               ││                      │││
                         │ │   │ Snapshots │   │     Peers     ││    Document view     │││
                         │ │   │           │   │               ││                      │││
                         │ │   │           │   │               ││                      │││
                         │ │   └───────────┘   └───────────────┘└──────────────────────┘││
                         │ │         │                 ▲                    ▲           ││
    ┌───────────────┐    │ └─────────┼─────────────────┼────────────────────┼───────────┘│
    │               │    │           ▼                 │                    │            │
    │               │    │  ┌────────────────┐   ┌──────────┐   ┌───────────────────────┐│
    │               │    │  │                │   │          │   │                       ││
    │               │    │  │                │   │          │   │                       ││
    │               │    │  │   IPFS Node    │   │   CRDT   │   │       Y.js CRDT       ││
    │    Network    │◀───┼─▶│                │◀─▶│transport │◀─▶│                       ││
    │               │    │  │                │   │          │   │                       ││
    │               │    │  │                │   │          │   │                       ││
    │               │    │  └────────────────┘   └──────────┘   └───────────────────────┘│
    │               │    │                                                  ▲            │
    │               │    │                                                  │            │
    └───────────────┘    │                                                  ▼            │
                         │                                           ┌────────────┐      │
                         │                                           │            │      │
                         │                                           │   Local    │      │
                         │                                           │   Store    │      │
                         │                                           │            │      │
                         │                                           └────────────┘      │
                         └───────────────────────────────────────────────────────────────┘

## IPFS node

A Peerpad instance contains a [js-ipfs](https://github.com/ipfs/js-ipfs#readme) node with the Pubsub feature enabled. This is crucial for the CRDT (see below) to work, as well as publishing snapshots

## CRDT

Each document is a CRDT of the text type. Underneath, Peerpad uses [the Y.js library](http://y-js.org) to create a shared data structure representing a document. This data structure is conflict free, allowing concurrend edition of the document by multiple nodes. ([Read more about CRDTs here](https://github.com/ipfs/research-CRDT)).

## CRDT Transport

The CRDT connects to other peers using a connector, which in our case is given to us by [the `y-ipfs-connector` library](https://github.com/ipfs-shipyard/y-ipfs-connector#readme). This library allows us to use the IPFS network stack as a means of discovery and message exchanging between nodes.

## Local store

The CRDT is then saved onto a local store. This store is encrypted using a symmetric key derived from the "read key".

ATTENTION: THIS IS NOT IMPLEMENTED YET! CRDT records are stored locally in the clear, so anyone with access to the local store can extract the CRDT. [Track this issue here](https://github.com/ipfs-shipyard/peerpad/issues/4).

## Document view

Computed out of a CRDT, you can compute the view, which, in our case, is the document. This will be used for rendering, and also for creating snapshots.

## Snapshotting

Snapshots will be a way of sharing an immutable version of the document without giving away neither the read nor the write keys. When sharing, this will happen:

* A new symmetric key will be generated
* The document (view) will be encrypted using this new key
* A self-contained version of the viewer and the encrypted document will be bundled and saved onto IPFS
* A URL will be made constructed, containing the key
* This URL will be made available for the user to share

## Attachments

Image attachments will be dropped onto the editor. When that happens, the file is added to IPFS, and then a link containing the hash is pasted onto the text.

## Participants

At any given moment, a Peerpad document will know which peers are connected to it, and whether they have read or write access. This identification is the IPFS node ID in anonymous mode, but can be extended to include the given user name by prompting the user.

The user names will form a separate shared data structure (also a CRDT), that can be used to identify the nodes in the UI (in lieu of the IPFS ID).

## Cursor position

Cursor position will also be a shared CRDT, an indication of where each peer is editing.
