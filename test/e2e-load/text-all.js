'use strict'

module.exports = (replicaId, text) => {

  const removals = []
  function addRemoval (removal) {
    console.log('added removal', removal)
    removals.push(removal)
  }

  function randomChar () {
    const pos = Math.floor(Math.random() * text.length)
    return [pos, text.charAt(pos)]
  }

  function setCurrent (_text) {
    text = _text
  }

  return {
    randomChar,
    addRemoval,
    setCurrent
  }
}
