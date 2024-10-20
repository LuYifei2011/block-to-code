import DarkTheme from '@blockly/theme-dark'
import 'blockly/blocks'
import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'
import { pythonGenerator } from 'blockly/python'
import * as Ch from 'blockly/msg/zh-hans'
//import * as En from 'blockly/msg/en'
import { getToolbox } from './toolbox.js'

import './assets/style/editor.css'
import * as utils from './utils'

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

const App: React.FC = () => {
  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)

  const paramsStr = window.location.search
  const params = new URLSearchParams(paramsStr)
  var filePath: string = params.get('file') || ''

  var workspace: Blockly.WorkspaceSvg
  var codeLanguage: string
  var extensions: string[] = []
  var toolbox = getToolbox()

  React.useEffect(() => {
    var blocklyArea = document.getElementById('blocklyArea')
    var blocklyDiv = document.getElementById('blocklyDiv')

    workspace = Blockly.inject(blocklyDiv, {
      toolbox: toolbox,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      trashcan: true,
      theme: DarkTheme
    })
    var onresize = function () {
      var element = blocklyArea
      var x = 0
      var y = 0
      do {
        x += element.offsetLeft
        y += element.offsetTop
        element = element.offsetParent
      } while (element)
      blocklyDiv.style.left = x + 'px'
      blocklyDiv.style.top = y + 'px'
      blocklyDiv.style.width = blocklyArea.offsetWidth + 'px'
      blocklyDiv.style.height = blocklyArea.offsetHeight + 'px'
      Blockly.svgResize(workspace)
    }
    window.addEventListener('resize', onresize, false)
    Blockly.setLocale(Ch)

    onresize()

    var project = JSON.parse(window.api.readFile(filePath))
    extensions = project.extensions
    codeLanguage = project.codeLanguage
    extensions.forEach((element) => {
      Function('Blockly', 'workspace', 'pythonGenerator', 'toolbox', 'Order', window.api.readFile(element))(Blockly, workspace, pythonGenerator, toolbox, Order)
    })

    workspace.updateToolbox(toolbox)
    Blockly.serialization.workspaces.load(project.workspace, workspace)

    return () => {
      window.removeEventListener('resize', onresize, false);
    };
  }, []);

  function undo() {
    Blockly.getMainWorkspace().undo(false)
  }

  function redo() {
    Blockly.getMainWorkspace().undo(true)
  }

  function save() {
    if (filePath) {
      var json = JSON.stringify({
        workspace: Blockly.serialization.workspaces.save(workspace),
        codeLanguage: codeLanguage,
        extensions: extensions
      })
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
      var code = ''
      if (codeLanguage === 'javascript') {
        code = javascriptGenerator.workspaceToCode(workspace)
      } else if (codeLanguage === 'python') {
        code = pythonGenerator.workspaceToCode(workspace)
        code = '#!/usr/bin/env python3\n\n' + code
      }
      window.api.writeFile(
        utils.getDirectory(filePath) +
          '/' +
          utils.getFileNameWithoutExtension(filePath) +
          (codeLanguage === 'javascript' ? '.js' : codeLanguage === 'python' ? '.py' : ''),
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
    Blockly.getMainWorkspace().trashcan.emptyContents()
  }

  function openAbout() {
    window.api.newWindow('../renderer/about.html', 600, 400)
  }

  const AddExtensions = () => {
    const filePath = useId('file-path')
    function chooseFile() {
      window.api.openFileDialog().then((path) => {
        if (path) {
          document.getElementById(filePath).defaultValue = path
        }
      })
    }
    function addExtension() {
      eval(window.api.readFile(document.getElementById(filePath).value))
      workspace.updateToolbox(toolbox)
      extensions.push(document.getElementById(filePath).value)
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
      <Toaster
        toasterId={toasterId}
        position="top-end"
        pauseOnHover
        pauseOnWindowBlur
        timeout={1000}
      />
      <div>
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
      <main>
        <div id="blocklyArea"></div>
        <div id="blocklyDiv"></div>
      </main>
    </FluentProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
