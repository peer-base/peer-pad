import React from 'react'
import {
  SnapshotIcon,
  LinkIcon,
  DirectoryIcon,
  SettingsIcon,
  ShortcutsIcon
} from './icons'

export default ({
  theme = 'light',
  onSnapshotClick,
  onLinkClick,
  onDirectoryClick,
  onSettingsClick,
  onShortcutsClick
}) => (
  <div className={`${theme === 'light' ? 'bg-white' : 'bg-cloud-burst'}`}>
    <Button theme={theme} icon={SnapshotIcon} title='Take snapshot' onClick={onSnapshotClick} />
    <Button theme={theme} icon={LinkIcon} title='Share link' onClick={onLinkClick} />
    <Button theme={theme} icon={DirectoryIcon} title='View directory' onClick={onDirectoryClick} />
    <Button theme={theme} icon={SettingsIcon} title='Settings' onClick={onSettingsClick} />
    <Button theme={theme} icon={ShortcutsIcon} title='Shortcuts' onClick={onShortcutsClick} />
  </div>
)

const Button = ({ theme, icon: Icon, title, onClick }) => (
  <button type='button' className={`button-reset db bg-transparent bw0 pigeon-post ${theme === 'light' ? 'hover--blue-bayox' : 'hover--white-lilac'} pointer mb2`} title={title} onClick={onClick}>
    <Icon className='db fill--current-color' style={{ width: '25px', height: '25px' }} />
  </button>
)
