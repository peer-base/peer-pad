import React from 'react'
import Editor from './Editor'
import Preview from './Preview'
import Toolbar from './toolbar/Toolbar'

const EditorArea = ({
  docName,
  docType,
  encodedKeys,
  docText,
  viewMode,
  onEditor,
  onEditorValueChange,
  snapshots,
  onTakeSnapshot,
  lastEditorValue,
  convertMarkdown,
  onDebuggingStart,
  onDebuggingStop,
  isDebuggingEnabled
}) => {
  const editor = (
    <Editor type={docType} onEditor={onEditor} onChange={onEditorValueChange} />
  )

  const toolbar = (
    <Toolbar
      theme={viewMode === 'source' ? 'dark' : 'light'}
      docType={docType}
      docName={docName}
      encodedKeys={encodedKeys}
      snapshots={snapshots}
      onTakeSnapshot={onTakeSnapshot}
      onDebuggingStart={onDebuggingStart}
      onDebuggingStop={onDebuggingStop}
      isDebuggingEnabled={isDebuggingEnabled}
    />
  )

  // No preview for richtext, source and preview are the same thing
  if (docType === 'richtext') {
    return (
      <div className='flex-auto flex-ns flex-row pb3' style={{ minHeight: '300px' }}>
        <div className='flex-auto overflow-scroll'>
          {editor}
        </div>
        {toolbar}
      </div>
    )
  }

  // source mode has no preview, only editor and toolbar
  if (viewMode === 'source') {
    return (
      <div className='flex-auto flex-ns flex-row pb3' style={{ minHeight: '300px' }}>
        <div className='flex-auto overflow-scroll'>
          {editor}
        </div>
        {toolbar}
      </div>
    )
  }

  const preview = <Preview md={docText} type={docType} convertMarkdown={convertMarkdown} />

  if (viewMode === 'both') {
    return (
      <div className='flex-auto flex-ns flex-row pb3' style={{ minHeight: '500px' }}>
        <div className='ph3 pl0-ns pr3-ns w-50-ns overflow-scroll'>
          {editor}
        </div>
        <div className='ph3 pl3 pr0-ns w-50-ns overflow-scroll'>
          {preview}
        </div>
        <div style={{ flexGrow: 0 }}>
          {toolbar}
        </div>
      </div>
    )
  }

  // viewMode === 'prevew'
  return (
    <div className='flex-ns flex-row' style={{ minHeight: '300px' }}>
      <div className='flex-auto'>
        {preview}
      </div>
      {toolbar}
    </div>
  )
}

export default EditorArea
