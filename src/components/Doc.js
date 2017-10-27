import React from 'react'

// Shared styling for in-editor preview, and snapshot rendering.
import './Doc.css'

const Doc = ({html = '', className = 'Doc', ...props}) => (
  <div
    className={className}
    dangerouslySetInnerHTML={{__html: html}}
    {...props} />
)

export default Doc
