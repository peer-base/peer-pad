import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DocViewerHTML from './DocViewerHTML'

class Doc extends Component {
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
          <DocViewerHTML encryptedDoc={this.props.encryptedDoc} />
        </body>
      </html>
    )
  }
}

Doc.propTypes = {
  encryptedDoc: PropTypes.object.isRequired
}

export default Doc
