import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Header from './header/Header'
import ViewMode from './header/ViewMode'
import { NewButton, PeersButton, NotificationsButton } from './header/buttons'
import Name from './Name'
import Editor from './Editor'
import Preview from './Preview'
import Toolbar from './toolbar/Toolbar'
import Status from './Status'
import Snapshots from './Snapshots'
import Links from './Links'
import DocViewer from './DocViewer'

class Edit extends Component {
  constructor (props) {
    super(props)

    console.log('props:', props)
    this._backend = props.backend
    const { type, name, readKey, writeKey } = props.match.params

    this.state = {
      name: decodeURIComponent(name),
      type: type,
      md: '',
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

    // Save the reference to the editor so we can unbind later or so we can
    // bind if there's no doc available yet
    this._editor = nextEditor

    // Bind new editor if not null and we have a document
    if (doc && nextEditor) doc.bindEditor(nextEditor)
  }

  onEditorValueChange (md) {
    this.setState({ md })
  }

  render () {
    const { name, type, md, rawKeys, status, canEdit, viewMode } = this.state
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
            <div className='flex-ns flex-row' style={{ minHeight: '500px' }}>
              <div className='ph3 pl0-ns pr3-ns w-50-ns'>
                <Editor type={type} onEditor={onEditor} onChange={onEditorValueChange} />
              </div>
              <div className='ph3 pl3 pr0-ns w-50-ns'>
                <Preview md={md} />
              </div>
              <div style={{ flexGrow: 0 }}>
                <Toolbar
                  theme='light'
                  docType={type}
                  docName={name}
                  docKeys={rawKeys} />
              </div>
            </div>
          ) : (
            <div>
              {viewMode === 'source' ? (
                <div className='flex-ns flex-row' style={{ minHeight: '300px' }}>
                  <div className='flex-auto'>
                    <Editor type={type} onEditor={onEditor} onChange={onEditorValueChange} />
                  </div>
                  <Toolbar
                    theme='dark'
                    docType={type}
                    docName={name}
                    docKeys={rawKeys} />
                </div>
              ) : (
                <div className='flex-ns flex-row' style={{ minHeight: '300px' }}>
                  <div className='flex-auto'>
                    <Preview md={md} />
                  </div>
                  <Toolbar
                    theme='light'
                    docType={type}
                    docName={name}
                    docKeys={rawKeys} />
                </div>
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
            {type === 'richtext' ? null : (
              <ViewMode mode={viewMode} onChange={onViewModeChange} />
            )}
          </div>
          <div>
            <span className='mr2'>
              <NewButton onClick={() => console.log('TODO')} />
            </span>
            <span className='mr2'>
              <PeersButton peerGroup={this._document && this._document.peers} />
            </span>
            <span>
              <NotificationsButton onClick={() => console.log('TODO')} count={2} />
            </span>
          </div>
        </Header>
        <div className='ph3'>
          <div className='mw8 center'>
            <div className='mb4 pb3 bb b--pigeon-post'>
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
