'use strict'

window.onerror = (err) => {
  let msg = 'An error occured, check the dev console'

  if (err.stack !== undefined) {
    msg = err.stack
  } else if (typeof err === 'string') {
    msg = err
  }

  $('#error-message').text(msg)
  $('#error-alert').show()
}