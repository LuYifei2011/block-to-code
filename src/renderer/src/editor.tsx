import './assets/style/editor.css'
import * as utils from './utils'
import { Workspaces } from './modules/workspaces'
import './react-i18next/i18n'
import { t } from 'i18next'
import React, { useTransition } from 'react'
import ReactDOM from 'react-dom/client'
import {
  useId,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  Toaster,
  useToastController,
  ToastTitle,
  Toast,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Input,
  useRestoreFocusTarget
} from '@fluentui/react-components'
import { OpenFolder24Regular } from '@fluentui/react-icons'
import * as Blockly from 'blockly/core'
import * as Ch from 'blockly/msg/zh-hans'

const App: React.FC = () => {
  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)

  const paramsStr = window.location.search
  const params = new URLSearchParams(paramsStr)
  var filePath: string = params.get('file') || ''

  var workspaces: Workspaces

  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = React.useState<string | null>(null);
  const [promptMessage, setPromptMessage] = React.useState<string | null>(null);
  const [promptDefaultValue, setPromptDefaultValue] = React.useState<string>('');
  const [promptCallback, setPromptCallback] = React.useState<(value: string | null) => void>(() => {});

  const handleAlertClose = () => setAlertMessage(null);
  const handleConfirmClose = (result: boolean) => {
    setConfirmMessage(null);
    confirmCallback(result);
  };
  const handlePromptClose = (result: string | null) => {
    setPromptMessage(null);
    promptCallback(result);
  };

  const initializeBlockly = () => {
    Blockly.Msg.CATLOGIC = "逻辑";
    Blockly.Msg.CATLOOPS = "循环";
    Blockly.Msg.CATMATH = "数学";
    Blockly.Msg.CATTEXT = "文本";
    Blockly.Msg.CATLISTS = "列表";
    Blockly.Msg.CATCOLOUR = "颜色";
    Blockly.Msg.CATVARIABLES = "变量";
    Blockly.Msg.CATFUNCTIONS = "函数";

    Blockly.dialog.setAlert((message, callback) => {
      setAlertMessage(message);
    });

    Blockly.dialog.setConfirm((message, callback) => {
      setConfirmMessage(message);
      setConfirmCallback(() => callback);
    });

    Blockly.dialog.setPrompt((message, defaultValue, callback) => {
      setPromptMessage(message);
      setPromptDefaultValue(defaultValue);
      setPromptCallback(() => callback);
    });
  };

  React.useEffect(() => {
    initializeBlockly()
    const mainDiv = document.getElementById('main') as HTMLDivElement
    if (mainDiv) {
      workspaces = new Workspaces(mainDiv)
      var project = JSON.parse(window.api.readFile(filePath))
      workspaces.load(project)
    } else {
      console.error('mainDiv is not defined')
    }
  }, [])

  function undo() {
    const activeWorkspace = workspaces.getActiveWorkspace()
    if (activeWorkspace) {
      activeWorkspace.undo(false)
    } else {
      console.warn('当前没有激活的工作区')
    }
  }

  function redo() {
    const activeWorkspace = workspaces.getActiveWorkspace()
    if (activeWorkspace) {
      activeWorkspace.undo(true)
    } else {
      console.warn('当前没有激活的工作区')
    }
  }

  function save() {
    if (filePath) {
      var json = JSON.stringify(workspaces.save())
      window.api.writeFile(filePath, json)
      dispatchToast(
        <Toast>
          <ToastTitle>{t('save_success')}</ToastTitle>
        </Toast>,
        { intent: 'success' }
      )
    }
  }

  function openFile() {
    window.api.openFileDialog().then((path) => {
      if (path) {
        window.location.href = 'editor.html?file=' + path
      }
    })
  }

  function newFile() {
    window.location.href = 'new.html'
  }

  function buildCode() {
    if (filePath) {
      var code = workspaces.generateCode()
      window.api.writeFile(
        utils.getDirectory(filePath) +
          '/' +
          utils.getFileNameWithoutExtension(filePath) +
          '.' +
          workspaces.getInfo().extensionName,
        code
      )
      dispatchToast(
        <Toast>
          <ToastTitle>{t('build_success')}</ToastTitle>
        </Toast>,
        { intent: 'success' }
      )
    }
  }

  function clearTrash() {
    const activeWorkspace = workspaces.getActiveWorkspace()
    if (activeWorkspace) {
      activeWorkspace.trashcan.emptyContents()
    } else {
      console.warn('当前没有激活的工作区')
    }
  }

  function openAbout() {
    window.api.newWindow('../renderer/about.html', 600, 400)
  }

  const AddExtensions = () => {
    const filePath = useId('file-path')
    function chooseFile() {
      window.api.openFileDialog().then((path) => {
        if (path) {
          (document.getElementById(filePath) as HTMLInputElement).defaultValue = path
        }
      })
    }
    function addExtension() {
      // eval(window.api.readFile((document.getElementById(filePath) as HTMLInputElement).value))
      // workspaces.getActiveWorkspace().updateToolbox(toolbox)
      // extensions.push(document.getElementById(filePath).value)
      dispatchToast(
        <Toast>
          <ToastTitle>{t('add_success')}</ToastTitle>
        </Toast>,
        { intent: 'success' }
      )
    }
    return (
      <Dialog>
        <DialogTrigger disableButtonEnhancement>
          <Button>{t('add_extension')}</Button>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('add_extension')}</DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">{t('cancel')}</Button>
              </DialogTrigger>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary" onClick={addExtension}>
                  {t('add')}
                </Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    )
  }

  const [open, setOpen] = React.useState(false)
  const restoreFocusTargetAttribute = useRestoreFocusTarget()

  return (
    <FluentProvider theme={webDarkTheme} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toaster toasterId={toasterId} position="top-end" pauseOnHover pauseOnWindowBlur timeout={1000} />
      <div style={{ position: 'static' }}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button>{t('file')}</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={newFile}>{t('new')}</MenuItem>
              <MenuItem onClick={openFile}>{t('open')}</MenuItem>
              <MenuItem onClick={save}>{t('save')}</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button>{t('edit')}</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={undo}>{t('undo')}</MenuItem>
              <MenuItem onClick={redo}>{t('redo')}</MenuItem>
              <MenuItem
                {...restoreFocusTargetAttribute}
                onClick={() => {
                  setOpen(true)
                }}
              >
                {t('clear_trash')}
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        <Button onClick={buildCode}>{t('build')}</Button>
        <Button>{t('run')}</Button>
        <AddExtensions />
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button>{t('help')}</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={openAbout}>{t('about')}</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
      <Dialog
        open={open}
        onOpenChange={(event, data) => {
          // it is the users responsibility to react accordingly to the open state change
          setOpen(data.open)
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('clear_trash')}</DialogTitle>
            <DialogContent>
              <p>{t('clear_trash_confirm')}</p>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">{t('cancel')}</Button>
              </DialogTrigger>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary" onClick={clearTrash}>
                  {t('clear')}
                </Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Dialog open={!!alertMessage} onOpenChange={handleAlertClose}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('alert')}</DialogTitle>
            <DialogContent>
              <p>{alertMessage}</p>
            </DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={handleAlertClose}>
                {t('ok')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Dialog open={!!confirmMessage} onOpenChange={() => handleConfirmClose(false)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('confirm')}</DialogTitle>
            <DialogContent>
              <p>{confirmMessage}</p>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => handleConfirmClose(false)}>
                {t('cancel')}</Button>
              <Button appearance="primary" onClick={() => handleConfirmClose(true)}>
                {t('ok')}</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Dialog open={!!promptMessage} onOpenChange={() => handlePromptClose(null)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('prompt')}</DialogTitle>
            <DialogContent>
              <p>{promptMessage}</p>
              <Input
                defaultValue={promptDefaultValue}
                onChange={(e) => setPromptDefaultValue(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => handlePromptClose(null)}>
                {t('cancel')}</Button>
              <Button appearance="primary" onClick={() => handlePromptClose(promptDefaultValue)}>
                {t('ok')}</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <div id="main" style={{ flex: 1 }}></div>
    </FluentProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

window.api.maximizeWindow()