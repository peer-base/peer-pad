import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const VIEWER_SCRIPT_URL = 'http://127.0.0.1:3000/static/js/viewer.bundle.js'

window.ReactDOM = ReactDOM

class DocViewer extends Component {
  render () {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>Peerpad doc</title>
        </head>
        <body>
          <noscript>
            You need to enable JavaScript to get this document.
          </noscript>
          <div id="react-app">Decrypting...</div>
          <script dangerouslySetInnerHTML={{__html: `
            window.peerpad = {
              encryptedDoc: new Uint8Array([${this.props.encryptedDoc.join(',')}])
            }
          `}} />
          <script src={VIEWER_SCRIPT_URL}></script>
        </body>
      </html>
    )
  }
}

DocViewer.propTypes = {
  encryptedDoc: PropTypes.object.isRequired
}

export default DocViewer
