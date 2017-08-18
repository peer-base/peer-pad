import React, { Component } from 'react';
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

class Edit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      canEdit: true
    }
  }

  render () {
    return (<div id="editor"></div>)
  }

  componentDidMount () {
    console.log('component has mounted')
    this.setState({
      editor: new Quill('#editor', {
        theme: 'snow'
      })
    })

    if (!this.state.canEdit) {
      this.state.editor.disable()
    }

  }
}

export default Edit