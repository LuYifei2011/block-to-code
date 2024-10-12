import React from 'react'
import ReactDOM from 'react-dom/client'
import { FluentProvider, webDarkTheme, Text } from '@fluentui/react-components'

const App: React.FC = () => {
  return (
    <FluentProvider theme={webDarkTheme}>
      <div style={{ padding: '20px' }}>
        <Text>Block To Code</Text>
        <Text>Version: 1.0.0</Text>
        {/* 添加更多关于信息 */}
      </div>
    </FluentProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
