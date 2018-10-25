'use strict'

const Diff = require('fast-diff')

module.exports = (text) => {
  const replicas = new Map()
  let validation
  let resolve
  let reject

  function finalize (replicaId, finalText, ops) {
    replicas.set(replicaId, {
      finalText,
      ops
    })

    // TODO: maybe check if all done, and then validate
    if (Array.from(replicas.keys()).every((replicaId) => !!replicas.get(replicaId))) {
      validateAll()
    }
  }

  function validateAll () {
    if (!validation) {
      validation = new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })
    }

    let size
    let text
    for (let [replicaId, result] of replicas) {
      if (!size) {
        size = result.finalText.length
      } else if (size !== result.finalText.length) {
        return reject(new Error(`replica ${replicaId} has unexpected final text length: ${result.finalText.length}. Expected ${size}`))
      }

      if (!text) {
        text = result.finalText
      } else if (text !== result.finalText) {
        return reject(new Error(`replica ${replicaId} has unexpected final text: ${result.finalText}. Expected ${text}`))
      }
    }

    resolve()
  }

  function validate () {
    if (!validation) {
      validation = new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })
    }

    return validation
  }

  function forReplica (replicaId) {
    replicas.set(replicaId, null)
    const startCodePoint = 32
    const endCodePoint = 126
    const originalText = text

    const ops = []
    function addOp (op) {
      console.log('added op', op)
      ops.push(op)
    }

    function randomRemovableChar () {
      const pos = Math.floor(Math.random() * text.length)
      return [pos, text.charAt(pos)]
    }

    function randomNewChar () {
      const pos = Math.floor(Math.random() * text.length)
      const codePoint = Math.floor(Math.random() * (endCodePoint - startCodePoint)) + startCodePoint
      return [pos, String.fromCodePoint(codePoint)]
    }

    function setCurrent (newText) {
      const diff = Diff(text, newText)
      if (diff.length !== 3) {
        console.log('diff:', diff)
      }
      text = newText
    }

    function setFinal (finalText) {
      setCurrent(finalText)
      finalize(replicaId, finalText, ops)
    }

    return {
      randomRemovableChar,
      randomNewChar,
      addOp,
      setCurrent,
      validate,
      setFinal
    }
  }

  return {
    forReplica,
    validate
  }
}
