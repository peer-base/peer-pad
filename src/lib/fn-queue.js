module.exports = () => {
  const queue = []
  let timeout

  return {
    push (fn) {
      queue.push(fn)
      schedule()
    },
    unshift (fn) {
      queue.unshift(fn)
      schedule()
    }
  }

  function schedule () {
    if (!timeout) {
      setTimeout(() => {
        timeout = null
        if (queue.length) {
          const fn = queue.shift()
          fn()
          schedule()
        }
      }, 0)
    }
  }
}