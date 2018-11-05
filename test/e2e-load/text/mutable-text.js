'use strict'

const Diff = require('fast-diff')

module.exports = (text) => {
  const initialText = text
  const replicas = new Map()
  let validation
  let resolve
  let reject

  console.log('TEXT:', text)

  function finalize (replicaId, finalText, ops, diffs) {
    replicas.set(replicaId, {
      initialText,
      finalText,
      ops,
      diffs
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
    let initialText
    let allOps = []

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

      initialText = result.initialText

      allOps = allOps.concat(result.ops)
    }

    // let replicaOps

    // for (let [replicaId, result] of replicas) {
    //   const { diffs } = result
    //   replicaOps = allOps
    //   for (let diff of diffs) {
    //     for (let [diffOp, text] of diff) {
    //       if (diffOp !== 0) { // add or remove
    //         console.log('validating diff [%j, %j]', diffOp, text)
    //         for (let t of text.split('')) {
    //           findAndRemoveOpForDiff(diffOp, t)
    //         }
    //       }
    //     }
    //   }

    //   console.log('remaining ops:', replicaOps)
    // }

    resolve()

    // function findAndRemoveOpForDiff (diffOp, text) {
    //   console.log(`Looking for [${diffOp}, ${text}]`)
    //   const lookingForOp = diffOp === -1 ? '-' : '+'
    //   const op = replicaOps.find(([op, opPos, opText]) => (op === lookingForOp) && opText.includes(text))

    //   if (!op) {
    //     throw new Error(`could not find op for [${diffOp}, ${text}]`)
    //   }

    //   console.log('op for [%j, %j]: %j', diffOp, text, op)
    //   let [opCode, opPos, opText] = op

    //   const index = opText.indexOf(text)
    //   opText = opText.substring(0, index) + opText.substring(index + 1)
    //   const opIndex = replicaOps.indexOf(op)
    //   console.log('opIndx:', opIndex)
    //   if (opText) {
    //     replicaOps[opIndex] = [opcode, opPos, opText]
    //   } else {
    //     replicaOps.splice(opIndex, 1)
    //   }
    // }


    // let expectedLength = initialText.length + Array.from(replicas.values()).reduce((acc, result) => {
    //   return result.ops.reduce((op) => op[0] === '-' ? -1 : 1, 0)
    // }, 0)
    // if (expectedLength !== size) {
    //   return reject(new Error(`after processing ops, final text length is not the expected. Expected ${expectedLength} and have ${size}`))
    // }

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
    const diffs = []

    function addOp (op) {
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
      diffs.push(diff)
      text = newText
    }

    function setFinal (finalText) {
      setCurrent(finalText)
      finalize(replicaId, finalText, ops, diffs)
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
