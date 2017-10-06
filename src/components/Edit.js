import React, { Component } from 'react'

import Quill from 'quill'
import 'quill/dist/quill.snow.css'

import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

import Peerpad from 'peerpad-core'
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
    const peers = this._peerpad && (<Peers peers={this._peerpad.peers} />)
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

            <Links name={this.state.name} keys={this.state.rawKeys} />
            <Status status={this.state.status} />
            {peers}
            <Snapshots takeSnapshot={this.takeSnapshot.bind(this)} />
          </div>
        </div>
      </div>)
  }

  async componentDidMount () {
    const peerpad = this._peerpad = Peerpad({
      type: this.state.type, // TODO: make this variable
      name: this.state.name,
      readKey: this.state.rawKeys.read,
      writeKey: this.state.rawKeys.write,
      docViewer: DocViewer
    })

    peerpad.network.once('started', () => this.setState({ status: 'started' }))

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
        readOnly: !this.state.canEdit
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

    peerpad.document.bindEditor(editor)
  }

  componentWillUnmount () {
    this._peerpad.stop()
  }

  async takeSnapshot () {
    return await this._peerpad.snapshots.take()
  }
}

export default Edit
