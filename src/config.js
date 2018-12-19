const NODE_ENV = process.env.NODE_ENV

const isDev = NODE_ENV === 'development'

const defaultSwarmAddresses = {
  development: '/ip4/0.0.0.0/tcp/9090/ws/p2p-websocket-star',
  production: '/dns4/ws-star1.par.dwebops.pub/tcp/443/wss/p2p-websocket-star'
}

const swarmAddress = defaultSwarmAddresses[NODE_ENV]

if (!swarmAddress) {
  throw new Error(`Could not find default swarm address for ${NODE_ENV} NODE_ENV`)
}

const swarmAddresses = [
  '/ip4/0.0.0.0/tcp/9090/ws/p2p-websocket-star',
  '/dns4/ws-star1.par.dwebops.pub/tcp/443/wss/p2p-websocket-star'
]

module.exports = {
  peerStar: {
    ipfs: {
      swarm: swarmAddresses,
      bootstrap: isDev ? [] : [
        '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
        '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
        '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
        '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
        '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
        '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
        '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
        '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6'
      ]
    },
    transport: {
      maxThrottleDelayMS: 1000
    }
  }
}
