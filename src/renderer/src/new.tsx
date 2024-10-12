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
  const fileLanguage = useId('file-language')
  const filePath = useId('file-path')

  function chooseFile(): void {
    window.api.saveFileDialog().then((path: string) => {
      if (path) {
        const element = document.getElementById(filePath) as HTMLInputElement
        if (element) {
          element.value = path
        }
      }
    })
  }

  function createFile(): void {
    const pathElement = document.getElementById(filePath) as HTMLInputElement
    const languageElement = document.getElementById(fileLanguage) as HTMLSelectElement
    if (pathElement && languageElement) {
      window.api.writeFile(
        pathElement.value,
        JSON.stringify({
          workspace: {},
          codeLanguage: languageElement.value,
          extensions: []
        })
      )
      window.location.href = '/editor.html?file=' + pathElement.value
    }
  }

  function cancel(): void {
    window.location.href = '/index.html'
  }

  return (
    <FluentProvider
      theme={webDarkTheme}
      style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <div style={{ margin: '50px' }}>
        <Title1>{t('newFile')}</Title1>
        <br />
        <div style={{ margin: '20px' }}>
          <Label htmlFor={filePath}>{t('filePath')}</Label>
          <br />
          <Input
            id={filePath}
            style={{ width: '100%' }}
            contentAfter={
              <Button
                onClick={chooseFile}
                appearance="transparent"
                size="small"
                icon={<OpenFolder24Regular />}
              />
            }
          />
          <br />
          <br />
          <Label htmlFor={fileLanguage}>{t('fileLanguage')}</Label>
          <Select id={fileLanguage}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </Select>
        </div>
        <div>
          <div style={{ bottom: 0, right: 0, position: 'absolute', margin: '50px' }}>
            <Button appearance="primary" onClick={createFile}>
              {t('create')}
            </Button>
          </div>
          <div style={{ bottom: 0, left: 0, position: 'absolute', margin: '50px' }}>
            <Button onClick={cancel}>{t('cancel')}</Button>
          </div>
        </div>
      </div>
    </FluentProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)