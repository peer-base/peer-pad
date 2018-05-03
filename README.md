<h1 align="center" title="PeerPad">
  <a href="https://peerpad.net/"><img width="555" alt="PeerPad logo" src="https://user-images.githubusercontent.com/152863/31819860-8a3d5080-b596-11e7-8e69-55c27f95d95d.png"></a>
</h1>

<p align="center">
  <a href="https://protocol.io"><img src="https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square" /></a>
  <a href="http://peerpad.net/"><img src="https://img.shields.io/badge/project-PeerPad-blue.svg?style=flat-square" /></a>
  <a href="http://webchat.freenode.net/?channels=%23ipfs"><img src="https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square" /></a>
  [![Build Status](https://travis-ci.org/ipfs-shipyard/peer-pad.svg?branch=master)](https://travis-ci.org/ipfs-shipyard/peer-pad)
</p>

[PeerPad](https://peerpad.net/) is a decentralized editor that allows concurrent writing of text. Besides making live changes to a given document, it allows read-only nodes to follow the changes in real-time. It also allows you to publish a self-contained snapshot of the document to IPFS.

**Test it live at https://peerpad.net or https://ipfs.io/ipns/peerpad.net**

Docs: [Architecture](docs/ARCHITECTURE.md), [Security](docs/SECURITY.md), [Technology](docs/TECHNOLOGY.md)

# 🔓 PeerPad is experimental software. It hasn't been audited, and as such shouldn't be used to create or share sensitive information.

## Install

```bash
$ git clone https://github.com/ipfs-shipyard/peerpad.git
$ cd peerpad
$ npm install
```

## Use locally

```bash
$ npm start
```

Head out to [http://localhost:3000](http://localhost:3000)

## Build

To build into the `build` dir, run:

```bash
$ npm run build
```

## Deploy

You can self-host your own Peerpad. For that, deploy the `build` directory (after you have run the `npm run build` command).

See [docs/DEPLOY.md] more info on how peerpad is deployed to https://peerpad.net 

### HTTPS

Some dependencies (like webcrypto) require that you're serving under HTTPS — unless it's `localhost`...

## Core API

See [peerpad-core](https://github.com/ipfs-shipyard/peerpad-core).

### Want to hack on PeerPad?

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/contributing.md)

## License

[MIT](https://github.com/ipfs-shipyard/peerpad/blob/master/LICENSE)
