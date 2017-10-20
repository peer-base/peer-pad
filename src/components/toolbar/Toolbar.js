import React from 'react'
import PropTypes from 'prop-types'
import {
  SnapshotIcon,
  DirectoryIcon,
  SettingsIcon,
  ShortcutsIcon
} from '../icons'
import { Button, LinkButton } from './buttons'

const Toolbar = ({
  theme = 'light',
  docType,
  docName,
  docKeys,
  takeSnapshot,
  snapshots
}) => (
  <div className={`${theme === 'light' ? 'bg-white' : 'bg-cloud-burst'} pt1`}>
    <div className='mb3'>
      <Button theme={theme} icon={SnapshotIcon} title='Take snapshot' onClick={takeSnapshot} />
    </div>
    <LinkButton theme={theme} docType={docType} docName={docName} docKeys={docKeys} />
    <div className='mb3'>
      <Button theme={theme} icon={DirectoryIcon} title='View directory' onClick={null} />
    </div>
    <div className='mb3'>
      <Button theme={theme} icon={SettingsIcon} title='Settings' onClick={null} />
    </div>
    <div className='mb3'>
      <Button theme={theme} icon={ShortcutsIcon} title='Shortcuts' onClick={null} />
    </div>
  </div>
)

Toolbar.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']),
  docType: PropTypes.oneOf(['markdown', 'richtext']).isRequired,
  docName: PropTypes.string.isRequired,
  docKeys: PropTypes.shape({
    read: PropTypes.string.isRequired,
    write: PropTypes.string
  }).isRequired,
  takeSnapshot: PropTypes.func.isRequired,
  snapshots: PropTypes.array.isRequired,
  onDirectoryClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
  onShortcutsClick: PropTypes.func.isRequired
}

export default Toolbar
