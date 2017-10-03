import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Doc extends Component {
  render () {
    return (
      <div>
        <div id="doc">Decrypting doc...</div>
        <script dangerouslySetInnerHTML={{__html: `
          const encryptedDoc = new Uint8Array([${this.props.encryptedDoc.join(',')}]);
          document.getElementById('doc').innerHTML = 'Decrypted!!!';
        `}}
        />
      </div>
    )
  }
}

Doc.propTypes = {
  encryptedDoc: PropTypes.object.isRequired
}

export default Doc
