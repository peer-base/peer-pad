'use strict'

const spawn = require('child_process').spawn

module.exports = () => {
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'serve:build'], {
      stdio: ['inherit', 'pipe', 'inherit']
    })
    build.stdout.on('data', (d) => {
      if (d.toString().indexOf('Hit CTRL-C to stop the server') >= 0) {
        resolve(build)
      }
    })
  })
}
