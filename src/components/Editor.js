import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import './Codemirror.css'

export default class Editor extends Component {
  constructor (props) {
    super(props)
    this.onRef = this.onRef.bind(this)
  }

  onRef (ref) {
    const { type, editable, onEditor, onChange } = this.props
    let editor = null

    if (ref) {
      if (type === 'richtext') {
        editor = new Quill(ref, {
          theme: 'snow'
        })

        if (!editable) {
          editor.disable()
        }
      } else {
        editor = CodeMirror(ref, {
          lineNumbers: true,
          value: '',
          viewportMargin: Infinity
        })

        editor.on('change', () => {
          if (onChange) onChange(editor.getValue(), editor)
        })
      }
    }

    if (onEditor) onEditor(editor)
  }

  render () {
    return <div ref={this.onRef} />
  }
}

Editor.propTypes = {
  type: PropTypes.oneOf(['richtext', 'markdown']),
  editable: PropTypes.bool,
  onEditor: PropTypes.func,
  onChange: PropTypes.func
}

Editor.defaultProps = {
  editable: true
}
