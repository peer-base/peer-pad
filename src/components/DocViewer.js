import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

window.ReactDOM = ReactDOM

// Minimal styling so the decrypting messages don't look too old school.
// This'll be applied to doc too.
const bodyStyle = {
  maxWidth: '54rem',
  margin: '0 auto',
  padding: '0 10px 50px',
  fontFamily: `-apple-system, BlinkMacSystemFont, 'avenir next', avenir, 'helvetica neue', helvetica, ubuntu, roboto, noto, 'segoe ui', arial, sans-serif`
}

class DocViewer extends Component {
  render () {
    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <title>PeerPad doc</title>
          {/* normalize.css@7.0.0 */}
          <link rel='stylesheet' type='text/css' href='https://ipfs.io/ipfs/QmZuSAW5kpxzaidmrpqoWmk8q5Yk7qqpGyxX3zRnRjnRVE' />
          <link rel='stylesheet' type='text/css' href='https://ipfs.io/ipfs/QmXZCNfBdmdxmoVUF8D7D1EJPeabXxX7yBuzKrnF2AP3Nm/katex.min.css' />
        </head>
        <body style={bodyStyle}>
          <noscript>
            You need to enable JavaScript to get this document.
          </noscript>
          <div id='react-app'>
            <div style={{display: 'table', width: '100%', height: '100vh'}}>
              <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
                Loading and decrypting...
              </div>
            </div>
          </div>
          <script dangerouslySetInnerHTML={{__html: `
            window.peerpad = {
              encryptedDoc: new Uint8Array([${this.props.encryptedDoc.join(',')}])
            }
          `}} />
          <script dangerouslySetInnerHTML={{__html: this.props.docScript}} />
        </body>
      </html>
    )
  }
}

DocViewer.propTypes = {
  encryptedDoc: PropTypes.object.isRequired,
  docScript: PropTypes.string.isRequired
}

export default DocViewer
