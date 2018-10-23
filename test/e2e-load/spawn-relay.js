'use strict'

const spawn = require('child_process').spawn

module.exports = () => {
  return new Promise((resolve, reject) => {
    const relay = spawn('npm', ['run', 'start:rendezvous'], {
      stdio: ['inherit', 'pipe', 'inherit']
    })
    relay.stdout.on('data', (d) => {
      if (d.toString().indexOf('Listening on') >= 0) {
        resolve(relay)
      }
    })
  })
}
