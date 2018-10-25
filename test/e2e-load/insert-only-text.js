'use strict'

const MutableText = require('./mutable-text')

module.exports = () => {
  let codePoint = 32
  const codeBreakPoints = {
    127: 32
  }

  const byReplica = new Map()
  const notFinishedReplicas = new Set()
  const resultsByReplica = new Map()

  let result = {}
  let evaluation = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })

  let allDone

  let mutableText

  const forReplica = (replicaId) => {
    const replica = ensureReplica(replicaId)
    const getText = () => {
      if (codeBreakPoints[codePoint]) {
        codePoint = codeBreakPoints[codePoint]
      }
      const c = String.fromCodePoint(codePoint)
      replica.push(c)
      codePoint++
      return c
    }

    getText.finished = () => {
      console.log(`replica ${replicaId} created ${byReplica.get(replicaId).length} characters`)
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

    getText.submitResult = (result) => {
      resultsByReplica.set(replicaId, result)
      maybeValidate()
    }

    getText.mutable = () => {
      if (!mutableText) {
        mutableText = MutableText(Array.from(resultsByReplica.values())[0])
      }
      return mutableText.forReplica(replicaId)
    }

    return getText
  }

  return { forReplica, results }

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

  function maybeValidate () {
    if (resultsByReplica.size === byReplica.size) {
      validate()
    }
  }

  function validate () {
    let size
    for (let [replicaId, value] of resultsByReplica) {
      if (!value.length) {
        return result.reject(new Error(`result of replica ${replicaId} has 0 length`))
      }
      if (!size) {
        size = value.length
      } else if (size !== value.length) {
        return result.reject(new Error(`result of replica ${replicaId} has different length from previous (${size}, ${value.length})`))
      }

      for (let [otherReplicaId, otherValue] of resultsByReplica) {
        if (replicaId === otherReplicaId) {
          continue
        }
        if (otherValue !== value) {
          return result.reject(new Error(`result of replica ${replicaId} has different content from ${otherReplicaId} (${value.length}, ${otherValue.length})`))
        }
      }
    }

    const expectedTotalLength = Array.from(byReplica.values()).reduce((acc, str) => acc + str.length, 0)
    const finalText = Array.from(resultsByReplica.values())[0]
    const totalLength = finalText.length

    if (!expectedTotalLength || !totalLength) {
      return result.reject(new Error(`Result text has unexpected length 0`))
    }

    if (expectedTotalLength !== totalLength) {
      return result.reject(new Error(`Result text has unexpected length. Expected ${expectedTotalLength} and had ${totalLength}`))
    }

    for (let [replicaId, value] of byReplica) {
      let text = finalText
      for (let ch of value) {
        const index = text.indexOf(ch)
        if (index < 0) {
          return result.reject(new Error(`Result text does not have input from replica ${replicaId}: ${ch}`))
        }
        text = text.substr(index + 1)
      }
    }

    result.resolve()
  }

  function results () {
    return evaluation
  }
}
