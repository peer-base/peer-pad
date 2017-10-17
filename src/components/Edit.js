import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Quill from 'quill'
import 'quill/dist/quill.snow.css'

import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import './Codemirror.css'

import Remark from 'remark'
import RemarkHtml from 'remark-html'

import Status from './Status'
import Peers from './Peers'
import Snapshots from './Snapshots'
import Links from './Links'
import DocViewer from './DocViewer'

const markdown = Remark().use(RemarkHtml)

class Edit extends Component {
  constructor (props) {
    super(props)

    console.log('props:', props)
    this._backend = props.backend
    const { type, name, readKey, writeKey } = props.match.params

    this.state = {
      name,
      type: type,
      html: '',
      status: 'offline',
      room: {},
      canEdit: !!writeKey,
      rawKeys: {
        read: readKey,
        write: writeKey
      }
    }
  }

  render () {
    const peers = this._document && (<Peers peers={this._document.peers} />)
    const editorContainer = this.state.type !== 'richtext' ?
      (
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-6'>
              <div id="editor"></div>
            </div>
            <div className='col-md-6'>
              <div dangerouslySetInnerHTML={{__html: this.state.html}} />
            </div>
          </div>
        </div>
      ) :
      (<div id='editor'></div>)

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-9'>
            {editorContainer}
          </div>

          <div className='col-md-3'>

            <Links type={this.state.type} name={this.state.name} keys={this.state.rawKeys} />
            <Status status={this.state.status} />
            {peers}
            <Snapshots takeSnapshot={this.takeSnapshot.bind(this)} />
          </div>
        </div>
      </div>)
  }

  async componentDidMount () {
    const docScript = await (await fetch('static/js/viewer.bundle.js')).text()

    const peerpad = this._document = this._backend.createDocument({
      type: this.state.type, // TODO: make this variable
      name: this.state.name,
      readKey: this.state.rawKeys.read,
      writeKey: this.state.rawKeys.write,
      docViewer: DocViewer,
      docScript
    })

    this._backend.network.once('started', () => this.setState({ status: 'started' }))

    await peerpad.start()

    const editorContainer = document.getElementById('editor')
    let editor

    // Editor
    if (this.state.type === 'richtext') {
      editor = new Quill(editorContainer, {
        theme: 'snow'
      })

      if (!this.state.canEdit) {
        editor.disable()
      }
    } else {
      editor = CodeMirror(editorContainer, {
        lineNumbers: true,
        value: 'function myscript() {}',
        viewportMargin: Infinity
      })

      editor.on('change', () => {
        markdown.process(editor.getValue(), (err, html) => {
          if (err) {
            throw err
          }
          this.setState({ html })
        })
      })
    }

    peerpad.bindEditor(editor)
  }

  componentWillUnmount () {
    this._document.stop()
  }

  async takeSnapshot () {
    return await this._document.snapshots.take()
  }
}

Edit.propTypes = {
  backend: PropTypes.object.isRequired
}


export default Edit
