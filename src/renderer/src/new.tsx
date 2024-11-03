import React from 'react'
import ReactDOM from 'react-dom/client'

import './react-i18next/i18n'
import { t } from 'i18next'

import {
  FluentProvider,
  webDarkTheme,
  useId,
  Select,
  Title1,
  Label,
  Button,
  Input
} from '@fluentui/react-components'

import { OpenFolder24Regular } from '@fluentui/react-icons'

const App: React.FC = () => {
  const fileLanguageId = useId('file-language')
  const filePathId = useId('file-path')

  function handleChooseFile(): void {
    window.api.saveFileDialog().then((path: string) => {
      if (path) {
        const element = document.getElementById(filePathId) as HTMLInputElement
        if (element) {
          element.value = path
        }
      }
    })
  }

  function handleCreateFile(): void {
    const pathElement = document.getElementById(filePathId) as HTMLInputElement
    const typeElement = document.getElementById(fileLanguageId) as HTMLSelectElement
    if (pathElement && typeElement) {
      window.api.writeFile(
        pathElement.value,
        JSON.stringify({
          data: {},
          type: typeElement.value
        })
      )
      window.location.href = '/editor.html?file=' + pathElement.value
    }
  }

  function handleCancel(): void {
    window.api.restoreWindow()
    window.location.href = '/index.html'
  }

  return (
    <FluentProvider
      theme={webDarkTheme}
      style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <div style={{ margin: '50px' }}>
        <Title1>{t('new_file')}</Title1>
        <br />
        <div style={{ margin: '20px' }}>
          <Label htmlFor={filePathId}>{t('file_path')}</Label>
          <br />
          <Input
            id={filePathId}
            style={{ width: '100%' }}
            contentAfter={
              <Button
                onClick={handleChooseFile}
                appearance="transparent"
                size="small"
                icon={<OpenFolder24Regular />}
              />
            }
          />
          <br />
          <br />
          <Label htmlFor={fileLanguageId}>{t('file_language')}</Label>
          <Select id={fileLanguageId}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </Select>
        </div>
        <div>
          <div style={{ bottom: 0, right: 0, position: 'absolute', margin: '50px' }}>
            <Button appearance="primary" onClick={handleCreateFile}>
              {t('create')}
            </Button>
          </div>
          <div style={{ bottom: 0, left: 0, position: 'absolute', margin: '50px' }}>
            <Button onClick={handleCancel}>{t('cancel')}</Button>
          </div>
        </div>
      </div>
    </FluentProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)

window.api.restoreWindow()
// window.api.resizeWindow(900, 670)