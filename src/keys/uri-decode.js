import { decode } from 'bs58'

export default function decodeKey (key) {
  return decode(decodeURIComponent(key))
}
