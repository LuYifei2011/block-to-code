import { useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom/client'

function Versions() {
  const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
    </ul>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Versions />)
