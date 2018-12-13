import React, { Component } from 'react'
import PropTypes from 'prop-types'

import config from '../config'
import { convert as convertMarkdown } from '../lib/markdown'
import bindEditor from '../lib/bind-editor'
import mergeAliases from '../lib/merge-aliases'
import takeSnapshot from '../lib/take-snapshot'

import Header from './header/Header'
import ViewMode from './header/ViewMode'
import { NewButton, PeersButton, NotificationsButton } from './header/buttons'
import EditorArea from './EditorArea'
import Status from './Status'
import DocViewer from './DocViewer'
import { toSnapshotUrl } from './SnapshotLink'

const debugScope = 'peer-star:collaboration:*'

const initialDocument = `
#### Welcome to PeerPad

This service allows you to write, collaborate and export markdown documents
directly in your browser!

Get started by start typing in the blue-pane to the right of this text. This
area will automatically start to reflect your new changes.

If you find any issues, please report them via GitHub here:
https://github.com/ipfs-shipyard/peer-pad/issues/new
`

// Status messages for the user to know what's going on
const stateStatuses = {
  IDLE: 'IDLE',
  NEEDS_SAVING: 'Needs saving...',
  WILL_SAVE: 'Will save soon...',
  SAVING: 'Saving...',
  SAVED: 'Saved!',
  TIMEOUT: 'Save timed out (NOT saved)',
  RECEIVING: 'Receiving data'
}

// How long time in MS we should wait before assuming the pinner timed out
const SAVE_TIMEOUT_MS = 1000 * 10

const stateColors = {
  [stateStatuses.NEEDS_SAVING]: '#e67e22',
  [stateStatuses.WILL_SAVE]: '#e67e22',
  [stateStatuses.SAVING]: '#e67e22',
  [stateStatuses.SAVED]: '#2ecc71',
  [stateStatuses.TIMEOUT]: '#e74c3c',
  [stateStatuses.RECEIVING]: '#3498db'
}

const StatusIcon = ({stateStatus}) => {
  const size = '10px'
  return <div style={{
    display: 'inline-block',
    height: size,
    width: size,
    lineHeight: size,
    borderRadius: size,
    backgroundColor: stateColors[stateStatus],
    border: '1px solid rgba(0,0,0,0.2)'
  }} />
}

const SavedStatus = ({stateStatus}) => {
  if (stateStatus === stateStatuses.IDLE) {
    return <div />
  }
  return <div><StatusIcon stateStatus={stateStatus} /> {stateStatus}</div>
}

class Edit extends Component {
  constructor (props) {
    super(props)

    this._backend = props.backend
    const { type, name, keys } = props.match.params

    this.state = {
      name: decodeURIComponent(name),
      type: type,
      documentText: initialDocument,
      status: 'offline',
      room: {},
      canEdit: keys.split('-').length >= 2,
      encodedKeys: keys,
      viewMode: 'both',
      snapshots: [],
      alias: window.localStorage.getItem('alias'),
      doc: null,
      isDebuggingEnabled: !!window.localStorage.getItem('debug'),
      stateStatus: stateStatuses.IDLE
    }

    this.onViewModeChange = this.onViewModeChange.bind(this)
    this.onEditor = this.onEditor.bind(this)
    this.onEditorValueChange = this.onEditorValueChange.bind(this)
    this.onTakeSnapshot = this.onTakeSnapshot.bind(this)
    this.onAliasChange = this.onAliasChange.bind(this)
    this.onDebuggingStart = this.onDebuggingStart.bind(this)
    this.onDebuggingStop = this.onDebuggingStop.bind(this)
  }

  onViewModeChange (viewMode) {
    this.setState({ viewMode })
  }

  onEditor (nextEditor) {
    const { doc } = this.state

    // Unbind current editor if we have a current editor and a document
    if (this._editorBinding) {
      this._editorBinding() // release binding
      this._editorBinding = null
    }

    // Save the reference to the editor so we can unbind later or so we can
    // bind if there's no doc available yet
    this._editor = nextEditor

    // Bind new editor if not null and we have a document
    if (doc && nextEditor) {
      this.maybeActivateEditor()
    }
  }

  onEditorValueChange (documentText) {
    this.setState({ documentText })
  }

  async onTakeSnapshot () {
    try {
      const docScript = await (await window.fetch('static/js/viewer.bundle.js')).text()
      const options = {
        type: this.state.type,
        docScript,
        DocViewer
      }
      const keys = (await import('peer-base')).keys
      const snapshot = await takeSnapshot(keys, this.state.doc, options)
      snapshot.createdAt = new Date().toISOString()
      this.setState(({ snapshots }) => ({ snapshots: [snapshot, ...snapshots] }))
      this.prefetchSnapshot(snapshot)
      this.storeSnapshot(snapshot)
    } catch (err) {
      console.error(err)
      window.alert('Error taking snapshot: ' + err.message)
    }
  }

  loadSnapshots () {
    const key = `${this.state.name}-snapshots`
    const val = window.localStorage.getItem(key)
    if (!val) return []
    try {
      return JSON.parse(val)
    } catch (err) {
      console.error('Failed to load snapshots for pad', key, err)
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

  async onAliasChange (alias) {
    this.setState({ alias })
    const doc = this.state.doc
    // cache globally for other pads to be able to use
    window.localStorage.setItem('alias', alias)
    const aliasesCollab = await doc.sub('aliases', 'mvreg')
    let aliases = mergeAliases(aliasesCollab.shared.value())
    const myPeerId = (await doc.app.ipfs.id()).id
    aliases[myPeerId] = alias
    aliasesCollab.shared.write(aliases)
  }

  async onDebuggingStart () {
    (await import('peer-base')).debug.enable(debugScope)
    window.localStorage.setItem('debug', debugScope)
    console.log('debugging started')
    this.setState({isDebuggingEnabled: true})
  }

  async onDebuggingStop () {
    (await import('peer-base')).debug.disable()
    window.localStorage.setItem('debug', '')
    console.log('debugging stopped')
    this.setState({isDebuggingEnabled: false})
  }

  render () {
    const {
      name,
      type,
      // The editor contents is updated directly by peer-pad-core.
      // `documentText` is a cache of the last value we received.
      documentText,
      encodedKeys,
      status,
      canEdit,
      viewMode,
      snapshots,
      alias,
      isDebuggingEnabled
    } = this.state

    const {
      onEditor,
      onEditorValueChange,
      onViewModeChange,
      onTakeSnapshot,
      onDebuggingStart,
      onDebuggingStop
    } = this

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
              <PeersButton doc={this.state.doc} alias={alias} onAliasChange={this.onAliasChange} canEdit={this.state.canEdit} />
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
                    readOnly={!canEdit}
                    data-id='document-title-input'
                  />
                </div>
                <div className='dn f7 pigeon-post'>
                  <b className='fw5'>Last change:</b> today, 12:00AM
                </div>
                <SavedStatus stateStatus={this.state.stateStatus} />
              </div>
            </div>
            <EditorArea
              docName={name}
              docType={type}
              encodedKeys={encodedKeys}
              viewMode={viewMode}
              onEditor={onEditor}
              onEditorValueChange={onEditorValueChange}
              snapshots={snapshots}
              onTakeSnapshot={onTakeSnapshot}
              docText={documentText}
              convertMarkdown={(md) => convertMarkdown(md, type)}
              onDebuggingStart={onDebuggingStart}
              onDebuggingStop={onDebuggingStop}
              isDebuggingEnabled={isDebuggingEnabled}
            />
          </div>
        </div>
      </div>
    )
  }

  async componentDidMount () {
    const PeerStar = await import('peer-base')

    if (!this._backend) {
      const peerStarConfig = window.__peerStarConfig ? window.__peerStarConfig : config.peerStar
      console.log('peer star config:', peerStarConfig)
      this._backend = PeerStar('peer-pad/2', peerStarConfig)
      this._backend.on('error', (err) => {
        console.error(err)
        window.alert(err.message)
      })
      await this._backend.start()
      this.props.onBackend(this._backend)
    }

    const keys = await PeerStar.keys.uriDecode(this.state.encodedKeys)

    const doc = await this._backend.collaborate(
      this.state.name,
      'rga',
      {
        keys
        // maxDeltaRetention: 0
      })

    let timeoutID = null
    doc.on('state changed', (fromSelf) => {
      if (fromSelf) {
        if (doc.replication.pinnerPeers().size) {
          if (doc.replication.isCurrentStatePersistedOnPinner()) {
            this.setState({stateStatus: stateStatuses.SAVED})
          } else {
            this.setState({stateStatus: stateStatuses.WILL_SAVE})
          }
        } else {
          this.setState({stateStatus: stateStatuses.NEEDS_SAVING})
        }
      }
    })

    doc.replication.on('pinning', () => {
      this.setState({stateStatus: stateStatuses.SAVING})
      clearTimeout(timeoutID)
      timeoutID = setTimeout(() => {
        this.setState({stateStatus: stateStatuses.TIMEOUT})
      }, SAVE_TIMEOUT_MS)
    })

    doc.replication.on('receiving', () => {
      this.setState({stateStatus: stateStatuses.RECEIVING})
    })

    doc.replication.on('pinned', () => {
      clearTimeout(timeoutID)
      this.setState({stateStatus: stateStatuses.SAVED})
    })

    this.setState({ doc })

    doc.on('error', (err) => {
      console.log(err)
      window.alert(err.message)
    })

    // Watch for out local ipfs node to come online.
    if (this._backend.ipfs.isOnline()) {
      this.setState({ status: 'online' })
    } else {
      this._backend.ipfs.once('started', () => {
        this.onDebuggingStart() // activate debugging
        this.setState({ status: 'online' })
      })
    }

    await doc.start()

    this.maybeActivateEditor()

    // Bind the editor if we got an instance while the doc was starting

    // TODO: bind the editor to the document
    // if (this._editor) doc.bindEditor(this._editor)

    // Turn the doc title into a peer editable input.

    // Pull snapshots array out of localStorage into state.
    const snapshots = this.loadSnapshots()
    this.setState({snapshots})
  }

  componentWillUnmount () {
    if (this.state.doc) {
      this.state.doc.stop()
    }

    this._editor = null
  }

  maybeActivateEditor () {
    if (!this._editorBinding && this._editor) {
      this._editorBinding = bindEditor(this.state.doc, this._titleRef, this._editor, this.state.type)
      if (this.state.canEdit) {
        this._editor.setOption('readOnly', false)
      }
      this._editor.refresh()
    }

    // if (this._editor && this.state.canEdit) {
    //   switch (this.state.type) {
    //     case 'richtext':
    //       this._editor.enable()
    //       this._editor.focus()
    //       break
    //   }
    // }
  }
}

Edit.propTypes = {
  backend: PropTypes.object,
  onBackend: PropTypes.func
}

export default Edit
