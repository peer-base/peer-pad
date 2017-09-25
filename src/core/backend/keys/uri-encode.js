import { encode } from 'bs58'

export default function encodeKey (key) {
  return encodeURIComponent(encode(Buffer.from(key)))
}
