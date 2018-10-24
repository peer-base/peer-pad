'use strict'

module.exports = (replicaId, text) => {

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

  function setCurrent (currentText) {
    text = currentText
  }

  return {
    randomRemovableChar,
    randomNewChar,
    addOp,
    setCurrent
  }
}
