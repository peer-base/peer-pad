import IPFS from 'ipfs'

const options = {
  EXPERIMENTAL: {
    pubsub: true
  }
}

let ipfs

async function createIPFS () {
  return new Promise((resolve, reject) => {
    if (!ipfs) {
      ipfs = new IPFS(options)
    }

    if (ipfs.isOnline()) {
      resolve(ipfs)
    } else {
      ipfs.once('ready', () => resolve(ipfs))
    }
  })
}

export default createIPFS