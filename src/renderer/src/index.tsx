import './assets/style/index.css'
import imgNewFile from './assets/img/new-file.svg'
import imgOpenFile from './assets/img/open-file.svg'

import './react-i18next/i18n'
import { t } from 'i18next'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { FluentProvider, webDarkTheme } from '@fluentui/react-components'
import { Settings24Regular } from '@fluentui/react-icons'
import { Button, Input } from '@fluentui/react-components'

const App: React.FC = () => {
  return (
    <FluentProvider
      theme={webDarkTheme}
      style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <div className="container">
        <div className="title">Block To Code</div>
        <br />
        <div style={{ display: 'grid' }}>
          <div style={{ gridRow: '1' }}>
            <Input type="text" placeholder="搜索最近打开的文件、文件夹" style={{ width: 'auto' }} />
          </div>
          <div style={{ gridRow: '1' }}>
            <div className="btn-group">
              <Button onClick={newFile}>
                <img src={imgNewFile} height="30px" width="30px" alt="New File" />
                {t('newFile')}
              </Button>
              <br />
              <Button onClick={openFile}>
                <img src={imgOpenFile} height="30px" width="30px" alt="Open File" />
                {t('openFile')}
              </Button>
            </div>
          </div>
        </div>
        <Button id="settings" shape="circular" icon={<Settings24Regular />} />
      </div>
    </FluentProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)

function newFile(): void {
  window.location.href = 'new.html'
}

function openFile(): void {
  window.api.openFileDialog().then((path: string) => {
    if (path) {
      window.location.href = 'editor.html?file=' + encodeURIComponent(path)
    }
  })
}

/* document.getElementById('settings').onclick = function () {
  window.electron.ipcSend('./settings.html', 900, 500)
} */