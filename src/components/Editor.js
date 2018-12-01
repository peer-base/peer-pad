import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import Quill from 'quill'
// import 'quill/dist/quill.bubble.css'
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'
import styles from './Codemirror.module.styl'

export default class Editor extends Component {
  constructor (props) {
    super(props)
    this.onRef = this.onRef.bind(this)
  }

  shouldComponentUpdate () {
    return false
  }

  onRef (ref) {
    this.editorEle = ref
  }

  componentDidMount () {
    const { onEditor, onChange } = this.props
    let editor

    if (this.editorEle) {
      // if (type === 'richtext') {
      //   editor = new Quill(ref, {
      //     theme: 'bubble'
      //   })

      //   editor.disable()
      // } else {
      // See: http://codemirror.net/doc/manual.html#config
      editor = CodeMirror(this.editorEle, {
        autofocus: true,
        inputStyle: 'contenteditable',
        lineNumbers: true,
        value: '',
        viewportMargin: Infinity,
        lineWrapping: true,
        mode: 'markdown',
        readOnly: 'nocursor'
      })

      editor.on('change', () => {
        if (onChange) onChange(editor.getValue(), editor)
      })

      window.__peerPadEditor = editor
      // }
    }

    if (onEditor) onEditor(editor)
  }

  render () {
    return (
      <div className={styles.CodeMirrorContainer}>
        <div ref={this.onRef} />
      </div>
    )
  }
}

Editor.propTypes = {
  type: PropTypes.oneOf(['richtext', 'markdown', 'math']),
  editable: PropTypes.bool,
  onEditor: PropTypes.func,
  onChange: PropTypes.func
}

Editor.defaultProps = {
  editable: true
}
