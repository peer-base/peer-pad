import React from 'react'

export const GATEWAY_PREFIX = 'https://gateway.ipfs.io/ipfs'

export const toSnapshotUrl = ({hash, key, gateway = GATEWAY_PREFIX}) => `${gateway}/${hash}/#${key}`

const SnapshotLink = ({snapshot, className, style, target = '_blank', children}) => (
  <a href={toSnapshotUrl(snapshot)} className={className} style={style} target={target}>
    {children || snapshot.hash}
  </a>
)

export default SnapshotLink
