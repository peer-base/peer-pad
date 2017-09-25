import IPFS from 'ipfs'

function maybeCreateIPFS (_ipfs) {
  let ipfs = _ipfs

  if (!ipfs) {
    ipfs = new IPFS({
      EXPERIMENTAL: {
        pubsub: true
      }
    })

    // const config = {
    //   config: {
    //     Addresses: {
    //       Swarm: [
    //         "/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star"
    //       ],
    //       API: '',
    //       Gateway: ''
    //     },
    //     EXPERIMENTAL: {
    //       pubsub: true
    //     }
    //   }
    // }

    // console.log('config:',config)

    // ipfs = new IPFS(config)
  }

  return ipfs
}

export default maybeCreateIPFS
