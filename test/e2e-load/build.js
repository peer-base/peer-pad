'use strict'

const spawn = require('child_process').spawn

module.exports = () => {
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' })
    build.once('close', (code) => {
      if (code !== 0) {
        reject(new Error(`build ended with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}
