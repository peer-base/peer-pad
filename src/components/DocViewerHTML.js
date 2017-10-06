import React, { Component } from 'react'
import PropTypes from 'prop-types'
// Hack to minimize source code size of doc snapshot..
import parseSymmetricalKey from 'peerpad-core/src/backend/keys/parse-symm-key'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap-theme.min.css'

class DocViewerHTML extends Component {

  constructor (props) {
    super(props)
    this.state = {
      doc: 'Decrypting doc...',
      error: null
    }
  }

  render () {
    const error = this.state.error && (<p class="error">Error: {this.state.error}</p>)
    return (
      <div>
        {error}
        <div id="doc" dangerouslySetInnerHTML={{__html: (!this.state.error && this.state.doc) || '' }} />
      </div>
    )
  }

  async componentDidMount () {
    try {
      const key = await parseSymmetricalKey(window.location.hash.substr(1))
      key.decrypt(this.props.encryptedDoc, (err, decrypted) => {
        if (err) {
          this.setState({error: err.message})
        } else {
          this.setState({ doc: decrypted.toString('utf8') })
        }
      })
    } catch (err) {
      this.setState({error: err.message })
    }
  }
}

DocViewerHTML.propTypes = {
  encryptedDoc: PropTypes.object.isRequired
}

export default DocViewerHTML
