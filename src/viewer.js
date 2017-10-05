import React from 'react'
import ReactDOM from 'react-dom'
import DocViewerHTML from './components/DocViewerHTML'

ReactDOM.render(
  <DocViewerHTML encryptedDoc={window.peerpad.encryptedDoc} />,
  document.getElementById('react-app'))

