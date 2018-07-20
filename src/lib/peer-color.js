import ColorHash from 'color-hash'
const colorHash = new ColorHash()

export default (peerId) => {
  return colorHash.hex(peerId.substring(Math.round(peerId.length / 2)))
}