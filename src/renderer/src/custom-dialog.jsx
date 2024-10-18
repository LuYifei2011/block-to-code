import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import * as Blockly from 'blockly/core'
import {
  FluentProvider,
  webDarkTheme,
  Button,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Input
} from '@fluentui/react-components'

var CustomDialog = {}

const rootElement = document.getElementById('dialog-root')
const root = ReactDOM.createRoot(rootElement)

const CustomDialogComponent = ({ title, message, onOkay, onCancel, showInput, onClose }) => {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    return () => {
      // 在组件卸载时重置状态
      setInputValue('');
      setIsOpen(true);
    }
  }, [])

  const handleOkay = () => {
    setIsOpen(false)
    onOkay && onOkay(showInput ? inputValue : null)
    onClose()
  }

  const handleCancel = () => {
    setIsOpen(false)
    onCancel && onCancel()
    onClose()
  }

  return (
    <FluentProvider theme={webDarkTheme}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogSurface>
          <DialogTitle>{title}</DialogTitle>
          <DialogBody>
            <DialogContent>{message}</DialogContent>
            {showInput && (
              <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            )}
          </DialogBody>
          <DialogActions>
            {onCancel && <Button onClick={handleCancel}>Cancel</Button>}
            <Button onClick={handleOkay}>OK</Button>
          </DialogActions>
        </DialogSurface>
      </Dialog>
    </FluentProvider>
  )
}

/** Override Blockly.dialog.setAlert() with custom implementation. */
Blockly.dialog.setAlert(function (message, callback) {
  console.log('Alert: ' + message)
  root.render(
    <CustomDialogComponent title="Alert" message={message} onOkay={callback} onClose={() => root.unmount()} />
  )
})

/** Override Blockly.dialog.setConfirm() with custom implementation. */
Blockly.dialog.setConfirm(function (message, callback) {
  console.log('Confirm: ' + message)
  root.render(
    <CustomDialogComponent
      title="Confirm"
      message={message}
      onOkay={() => { callback(true); }}
      onCancel={() => { callback(false); }}
      showInput={false}
      onClose={() => root.unmount()}
    />
  )
})

/** Override Blockly.dialog.setPrompt() with custom implementation. */
Blockly.dialog.setPrompt(function (message, defaultValue, callback) {
  console.log('Prompt: ' + message)
  root.render(
    <CustomDialogComponent
      title="Prompt"
      message={message}
      onOkay={(input) => callback(input)}
      onCancel={() => callback(null)}
      showInput={true}
      onClose={() => root.unmount()}
    />
  )
})
