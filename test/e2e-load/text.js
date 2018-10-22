'use strict'

module.exports = () => {
  let codePoint = 32
  const byReplica = new Map()
  const notFinishedReplicas = new Set()
  let allDone

  const forReplica = (replicaId) => {
    const replica = ensureReplica(replicaId)
    const getText = () => {
      if (codePoint === 127) {
        codePoint = 32
      }
      const c = String.fromCodePoint(codePoint)
      replica.push(c)
      codePoint++
      return c
    }

    getText.finished = () => {
      notFinishedReplicas.delete(replicaId)
    }

    getText.allDone = () => {
      if (allDone) {
        return allDone
      }
      allDone = new Promise((resolve, reject) => {
        if (areAllDone()) {
          resolve()
        } else {
          const interval = setInterval(() => {
            if (areAllDone()) {
              clearInterval(interval)
              resolve()
            }
          }, 500)
        }
      })
      return allDone
    }

    return getText
  }

  return { forReplica }

  function ensureReplica (replicaId) {
    let replica = byReplica.get(replicaId)
    if (!replica) {
      replica = []
      byReplica.set(replicaId, replica)
      notFinishedReplicas.add(replicaId)
    }
    return replica
  }

  function areAllDone () {
    return byReplica.size && (notFinishedReplicas.size === 0)
  }
}
