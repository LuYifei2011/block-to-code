import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  useId,
  Select,
  Title1,
  Label,
  Button,
  Input
} from '@fluentui/react-components'

import { OpenFolder24Regular } from '@fluentui/react-icons'

const App = () => {
  const fileLanguage = useId('file-language')
  const filePath = useId('file-path')

  function chooseFile() {
    window.api.saveFileDialog().then((path) => {
      if (path) {
        document.getElementById(filePath).defaultValue = path
      }
    })
  }

  function createFile() {
    window.api.writeFile(
      document.getElementById(filePath).value,
      JSON.stringify({
        workspace: {},
        codeLanguage: document.getElementById(fileLanguage).value,
        extensions: []
      })
    )
    window.location.href = '/editor.html?file=' + document.getElementById(filePath).value
  }

  function cancle() {
    window.location.href = '/index.html'
  }

  return (
    <FluentProvider theme={webDarkTheme} style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
      <div style={{ margin: '50px' }}>
        <Title1>新建文件</Title1>
        <br />
        <div style={{ margin: '20px' }}>
          <Label htmlFor={filePath}>文件路径</Label>
          <br />
          <Input id={filePath} style={{ width: '100%' }} contentAfter={<Button onClick={chooseFile} appearance="transparent" size='small' icon={<OpenFolder24Regular />} />} />
          <br />
          <br />
          <Label htmlFor={fileLanguage}>文件类型</Label>
          <Select id={fileLanguage}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </Select>
        </div>
        <div>
          <div style={{ bottom: 0, right: 0, position: 'absolute', margin: '50px' }}>
            <Button appearance="primary" onClick={createFile}>创建</Button>
          </div>
          <div style={{ bottom: 0, left: 0, position: 'absolute', margin: '50px' }}>
            <Button onClick={cancle}>取消</Button>
          </div>
        </div>
      </div>
    </FluentProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
