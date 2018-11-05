'use strict'

const spawn = require('child_process').spawn

module.exports = () => {
  return new Promise((resolve, reject) => {
    let started = false
    const pinner = spawn('npm', ['run', 'start:test:pinner'], {
      stdio: ['inherit', 'pipe', 'inherit']
    })
    pinner.stdout.on('data', (d) => {
      if (!started && d.toString().indexOf('Swarm listening on') >= 0) {
        started = true
        resolve(pinner)
      }
      process.stdout.write(d)
    })
  })
}
