import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Header from './header/Header'
import ViewMode from './header/ViewMode'
import { NewButton, PeersButton, NotificationsButton } from './header/buttons'
import Editor from './Editor'
import Preview from './Preview'
import Toolbar from './toolbar/Toolbar'
import Status from './Status'
import DocViewer from './DocViewer'
import { toSnapshotUrl } from './SnapshotLink'

class Edit extends Component {
  constructor (props) {
    super(props)

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

    this.onViewModeChange = this.onViewModeChange.bind(this)
    this.onEditor = this.onEditor.bind(this)
    this.onEditorValueChange = this.onEditorValueChange.bind(this)
    this.onTakeSnapshot = this.onTakeSnapshot.bind(this)
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
    snapshot.createdAt = new Date().toISOString()
    this.setState(({ snapshots }) => ({ snapshots: [snapshot, ...snapshots] }))
    this.prefetchSnapshot(snapshot)
    this.storeSnapshot(snapshot)
  }

  loadSnapshots () {
    const key = `${this.state.name}-snapshots`
    const val = window.localStorage.getItem(key)
    if (!val) return []
    try {
      return JSON.parse(val)
    } catch (err) {
      console.log('Failed to load snapshots for pad', key, err)
      // bad data. clear out for a better future.
      window.localStorage.removeItem(key)
      return []
    }
  }

  storeSnapshot (snapshot) {
    const snapshots = this.loadSnapshots()
    const key = `${this.state.name}-snapshots`
    const val = JSON.stringify([snapshot, ...snapshots])
    window.localStorage.setItem(key, val)
  }

  // Prefetch snapshot from gateway to makes it load faster when user clicks a snap shot link
  async prefetchSnapshot (snapshot) {
    const url = toSnapshotUrl(snapshot)
    return window.fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gateway response was not ok')
        }
      }).catch((err) => {
        console.log('Failed to pre-fetch snapshot', url, err)
      })
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
      onTakeSnapshot
    } = this

    let editorContainer

    if (type === 'richtext') {
      editorContainer = (
        <Editor type={type} onEditor={onEditor} onChange={onEditorValueChange} />
      )
    } else {
      editorContainer = (
        <div>
          {viewMode === 'both' ? (
            <div className='flex-ns flex-row'>
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
                  docKeys={rawKeys}
                  snapshots={snapshots}
                  onTakeSnapshot={onTakeSnapshot} />
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
                    docKeys={rawKeys}
                    snapshots={snapshots}
                    onTakeSnapshot={onTakeSnapshot} />
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
                    docKeys={rawKeys}
                    snapshots={snapshots}
                    onTakeSnapshot={onTakeSnapshot} />
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
          <div className='mr2'>
            <Status status={status} />
          </div>
          <div>
            <span className='mr2'>
              <NewButton />
            </span>
            <span className='mr0'>
              <PeersButton peerGroup={this._document && this._document.peers} />
            </span>
            <span>
              <NotificationsButton />
            </span>
          </div>
        </Header>
        <div className='ph3'>
          <div className='mw8 center'>
            <div className='mb4 pb3 bb b--pigeon-post'>
              <div className='flex flex-row items-center'>
                <div className='flex-auto'>
                  <input
                    ref={(ref) => { this._titleRef = ref }}
                    type='text'
                    className='input-reset sans-serif bw0 f4 blue-bayox w-100 pa0'
                    placeholder='Document Title'
                    readonly={canEdit} />
                </div>
                <div className='f7 pigeon-post'>
                  <b className='fw5'>Last change:</b> today, 12:00AM
                </div>
              </div>
            </div>
            <div>
              {editorContainer}
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

    // Watch for out local ipfs node to come online.
    if (this._backend.network.hasStarted()) {
      this.setState({ status: 'online' })
    } else {
      this._backend.network.once('started', () => this.setState({ status: 'online' }))
    }

    await doc.start()

    this._document = doc

    // Bind the editor if we got an instance while the doc was starting
    if (this._editor) doc.bindEditor(this._editor)

    // Turn the doc title into a peer editable input.
    doc.bindTitle(this._titleRef)

    // ooh la la, show the live value in the tab title too.
    doc.bindTitle(window.document.getElementsByTagName('title')[0])

    // Pull snapshots array out of localStorage into state.
    const snapshots = this.loadSnapshots()
    this.setState({snapshots})
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
