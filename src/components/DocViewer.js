import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

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
          <div className='container-fluid'>
            <div id="react-app">Decrypting...</div>
          </div>
          <script dangerouslySetInnerHTML={{__html: `
            window.peerpad = {
              encryptedDoc: new Uint8Array([${this.props.encryptedDoc.join(',')}])
            }
          `}} />
          <script dangerouslySetInnerHTML={{__html: this.props.docScript }} />
        </body>
      </html>
    )
  }
}

DocViewer.propTypes = {
  encryptedDoc: PropTypes.object.isRequired,
  docScript: PropTypes.string.isRequired,
}

export default DocViewer
