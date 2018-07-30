module.exports = {
  peerStar: {
    ipfs: {
      // swarm: ['/dns4/ws-star2.sjc.dwebops.pub/tcp/443/wss/p2p-websocket-star']
      // swarm: ['/dns4/ws-star1.par.dwebops.pub/tcp/443/wss/p2p-websocket-star']
      swarm: ['/ip4/127.0.0.1/tcp/9090/ws/p2p-websocket-star']
    },
    transport: {
      maxThrottleDelayMS: 0
    }
  }
}
