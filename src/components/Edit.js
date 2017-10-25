import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Header from './header/Header'
import ViewMode from './header/ViewMode'
import { NewButton, PeersButton, NotificationsButton } from './header/buttons'
import Name from './Name'
import EditorArea from './EditorArea'
import Status from './Status'
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
      viewMode: 'both',
      snapshots: []
    }

    this.onNameChange = this.onNameChange.bind(this)
    this.onViewModeChange = this.onViewModeChange.bind(this)
    this.onEditor = this.onEditor.bind(this)
    this.onEditorValueChange = this.onEditorValueChange.bind(this)
    this.onTakeSnapshot = this.onTakeSnapshot.bind(this)
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

  async onTakeSnapshot () {
    const snapshot = await this._document.snapshots.take()
    console.log({ snapshot })
    this.setState(({ snapshots }) => ({ snapshots: [snapshot, ...snapshots] }))
  }

  render () {
    const {
      name,
      type,
      md,
      rawKeys,
      status,
      canEdit,
      viewMode,
      snapshots
    } = this.state

    const {
      onEditor,
      onEditorValueChange,
      onViewModeChange,
      onNameChange,
      onTakeSnapshot
    } = this

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
            <EditorArea
              docName={name}
              docType={type}
              docKeys={rawKeys}
              viewMode={viewMode}
              onEditor={onEditor}
              onEditorValueChange={onEditorValueChange}
              snapshots={snapshots}
              onTakeSnapshot={onTakeSnapshot}
              previewMd={md} />
            <div>
              <Status status={status} />
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
}

Edit.propTypes = {
  backend: PropTypes.object.isRequired
}

export default Edit
