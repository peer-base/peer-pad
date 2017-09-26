import IPFS from 'ipfs'

function maybeCreateIPFS (_ipfs) {
  let ipfs = _ipfs

  if (!ipfs) {
    ipfs = new IPFS({
      EXPERIMENTAL: {
        pubsub: true
      }
    })
  }

  return ipfs
}

export default maybeCreateIPFS
