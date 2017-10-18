import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Remark from 'remark'
import RemarkHtml from 'remark-html'

import Header from './header/Header'
import ViewMode from './header/ViewMode'
import { NewButton, UserButton, NotificationsButton } from './header/buttons'
import Name from './Name'
import Editor from './Editor'
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
      },
      viewMode: 'both'
    }

    this.onNameChange = this.onNameChange.bind(this)
    this.onViewModeChange = this.onViewModeChange.bind(this)
    this.onEditor = this.onEditor.bind(this)
    this.onEditorValueChange = this.onEditorValueChange.bind(this)
    this.takeSnapshot = this.takeSnapshot.bind(this)
  }

  onNameChange (name) {
    // TODO: persist document name
    this.setState({ name })
  }

  onViewModeChange (viewMode) {
    this.setState({ viewMode })
  }

  onEditor (nextEditor) {
    const { _document: doc, _editor: editor } = this

    // Unbind current editor if we have a current editor and a document
    if (doc && editor) doc.unbindEditor(editor)

    // Save the referebnce to the editor so we can unbind later or so we can
    // bind if there's no doc available yet
    this._editor = nextEditor

    // Bind new editor if not null and we have a document
    if (doc && nextEditor) doc.bindEditor(nextEditor)
  }

  onEditorValueChange (value) {
    markdown.process(value, (err, html) => {
      if (err) return console.error('Failed to convert markdown to HTML', err)
      this.setState({ html })
    })
  }

  render () {
    const peers = this._document && (<Peers peers={this._document.peers} />)
    const { name, type, html, rawKeys, status, canEdit, viewMode } = this.state
    const { onEditor, onEditorValueChange, onViewModeChange, onNameChange } = this

    let editorContainer

    if (type === 'richtext') {
      editorContainer = (
        <Editor type={type} onEditor={onEditor} onChange={onEditorValueChange} />
      )
    } else {
      editorContainer = (
        <div>
          {viewMode === 'both' ? (
            <div className='cf'>
              <div className='fl w-100 w-50-ns ph2 pl0-ns pr2-ns'>
                <Editor type={type} onEditor={onEditor} onChange={onEditorValueChange} />
              </div>
              <div className='fl w-100 w-50-ns ph2 pl2 pr0-ns'>
                <div dangerouslySetInnerHTML={{__html: html}} />
              </div>
            </div>
          ) : (
            <div>
              {viewMode === 'source' ? (
                <Editor type={type} onEditor={onEditor} onChange={onEditorValueChange} />
              ) : (
                <div dangerouslySetInnerHTML={{__html: html}} />
              )}
            </div>
          )}
        </div>
      )
    }

    return (
      <div>
        <Header>
          <div className='flex-auto'>
            <ViewMode mode={viewMode} onChange={onViewModeChange} />
          </div>
          <div>
            <span className='mr1'>
              <NewButton onClick={() => console.log('TODO')} />
            </span>
            <span className='mr1'>
              <UserButton onClick={() => console.log('TODO')} count={1} />
            </span>
            <span>
              <NotificationsButton onClick={() => console.log('TODO')} count={2} />
            </span>
          </div>
        </Header>
        <div className='ph3'>
          <div className='mw8 center'>
            <div className='mb3 pb3 bb b--pigeon-post'>
              <div className='flex flex-row items-center'>
                <div className='flex-auto'>
                  <Name value={name} onChange={onNameChange} editable={canEdit} />
                </div>
                <div className='f7 pigeon-post'>
                  <b className='fw5'>Last change:</b> today, 12:00AM
                </div>
              </div>
            </div>
            <div>
              {editorContainer}
            </div>

            <div>
              <Links type={type} name={name} keys={rawKeys} />
              <Status status={status} />
              {peers}
              <Snapshots takeSnapshot={this.takeSnapshot} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  async componentDidMount () {
    const docScript = await (await window.fetch('static/js/viewer.bundle.js')).text()

    const doc = this._backend.createDocument({
      type: this.state.type, // TODO: make this variable
      name: this.state.name,
      readKey: this.state.rawKeys.read,
      writeKey: this.state.rawKeys.write,
      docViewer: DocViewer,
      docScript
    })

    this._backend.network.once('started', () => this.setState({ status: 'started' }))

    await doc.start()

    this._document = doc

    // Bind the editor if we got an instance while the doc was starting
    if (this._editor) doc.bindEditor(this._editor)
  }

  componentWillUnmount () {
    this._document.stop()
    this._editor = null
  }

  async takeSnapshot () {
    return this._document.snapshots.take()
  }
}

Edit.propTypes = {
  backend: PropTypes.object.isRequired
}

export default Edit
