import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const VIEWER_ASSET_URL_BASE = 'http://127.0.0.1:3000/'
const VIEWER_CSS_URLS = [
  VIEWER_ASSET_URL_BASE + 'css/bootstrap.min.css',
  VIEWER_ASSET_URL_BASE + 'css/bootstrap-theme.min.css'
]
const VIEWER_SCRIPT_URL = VIEWER_ASSET_URL_BASE + 'static/js/viewer.bundle.js'

window.ReactDOM = ReactDOM

class DocViewer extends Component {
  render () {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          {VIEWER_CSS_URLS.map((url, index) => <link key={index} href={url} media="all" rel="stylesheet" />)}
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
