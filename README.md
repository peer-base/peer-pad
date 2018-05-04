<h1 align="center" title="PeerPad">
  <a href="https://peerpad.net/"><img width="555" alt="PeerPad logo" src="https://user-images.githubusercontent.com/152863/31819860-8a3d5080-b596-11e7-8e69-55c27f95d95d.png"></a>
</h1>

<p align="center">
  <a href="https://protocol.io"><img src="https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square" /></a>
  <a href="http://peerpad.net/"><img src="https://img.shields.io/badge/project-PeerPad-blue.svg?style=flat-square" /></a>
  <a href="http://webchat.freenode.net/?channels=%23ipfs"><img src="https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square" /></a>
  <a href="https://travis-ci.org/ipfs-shipyard/peer-pad" title="Travis build status">
    <img src="https://travis-ci.org/ipfs-shipyard/peer-pad.svg?branch=master" />
  </a>
</p>

[PeerPad](https://peerpad.net/) is a decentralized editor that allows concurrent writing of text. Besides making live changes to a given document, it allows read-only nodes to follow the changes in real-time. It also allows you to publish a self-contained snapshot of the document to IPFS.

**Test it live at https://peerpad.net or https://ipfs.io/ipns/peerpad.net**

Docs: [Architecture](docs/ARCHITECTURE.md), [Security](docs/SECURITY.md), [Technology](docs/TECHNOLOGY.md)

## 🔓 PeerPad is experimental software. It hasn't been audited, and as such shouldn't be used to create or share sensitive information.

## Install

With the following installed:
- git
- node >= 8
- npm >= 6

Clone the repo and install the dependencies from npm.

```bash
git clone https://github.com/ipfs-shipyard/peer-pad.git
cd peer-pad
npm install
```

## Usage

For local *development* with hot code reloading

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

To build into the `build` dir, run:

```bash
npm run build
```

## Testing

To run the **unit** tests:

```bash
npm test
```

To run the **end-to-end** smoke test that runs Peerpad in multiple, headless Chrome instances run:

```bash
npm run build
npm run test:e2e:ci
```

The e2e tests expect the site to already be running, so the `test:e2e:ci` will fire up an http-server before running the tests in [test/e2e](tests/e2e).

If you're running the dev server on the default port (via `npm start`) then you can run the e2e tests without starting a server with:

```bash
npm run test:e2e
```

By default the Chrome instances run headless, so you won't see the robots clicking around in the browser. **To debug** the tests and see what's going pass `DEBUG=true` as an env var.

```bash
DEBUG=true npm run test:e2e
```

To run the e2e test against a deployed version, just pass the url as an env var

```bash
URL=https://peerpad.net npm run test:e2e
```



## Deploy

You can self-host your own Peerpad. For that, run `npm run build` and deploy the `build` directory to a web-server

See [docs/DEPLOY.md](docs/DEPLOY.md) more info on how Peerpad is deployed to https://peerpad.net

Some dependencies (like webcrypto) require that you're serving under HTTPS — unless it's `localhost`...

## Contribute

The Peerpad is a work in progress. As such, there's a few things you can do right now to help out:

* **[Check out the existing issues](https://github.com/ipfs-shipyard/peer-pad/issues)**!
* **Perform code reviews**. More eyes will help a) speed the project along b) ensure quality and c) reduce possible future bugs.
* **Add tests**. There can never be enough tests.

### Want to hack on PeerPad?

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/contributing.md)

## License

[MIT](https://github.com/ipfs-shipyard/peer-pad/blob/master/LICENSE)
