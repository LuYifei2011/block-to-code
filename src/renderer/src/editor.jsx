import DarkTheme from '@blockly/theme-dark'
import * as libraryBlocks from 'blockly/blocks'
import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'
import { pythonGenerator } from 'blockly/python'
import * as Ch from 'blockly/msg/zh-hans'
//import * as En from 'blockly/msg/en'
import { getToolbox } from './toolbox.js'

import './assets/style/editor.css'

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
  useRestoreFocusTarget,
  ProgressBar
} from '@fluentui/react-components'
import { OpenFolder24Regular } from '@fluentui/react-icons'

const App = () => {
  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)
  const [isPending, startTransition] = useTransition()
  var loadingRoot

  const paramsStr = window.location.search
  const params = new URLSearchParams(paramsStr)
  var filePath = params.get('file') || ''

  var workspace
  var codeLanguage
  var extensions
  var toolbox = getToolbox()

  React.useEffect(() => {
    const initializeBlockly = async () => {
      loadingRoot = ReactDOM.createRoot(document.getElementById('loading'))
      showLoading()

      var blocklyArea = document.getElementById('blocklyArea')
      var blocklyDiv = document.getElementById('blocklyDiv')

      await new Promise((resolve) => setTimeout(resolve, 10))

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
      workspace.addChangeListener(function (event) {
        if (event.type == Blockly.Events.FINISHED_LOADING) {
          hideLoading()
        }
      })
      var onresize = function (e) {
        var element = blocklyArea
        var x = 0
        var y = 0
        do {
          x += element.offsetLeft
          y += element.offsetTop
          element = element.offsetParent
        } while (element)
        blocklyDiv.style.left = x + 'px'
        blocklyDiv.style.top = y - 32 + 'px'
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px'
        blocklyDiv.style.height = blocklyArea.offsetHeight - 32 + 'px'
        Blockly.svgResize(workspace)
      }
      window.addEventListener('resize', onresize, false)
      Blockly.setLocale(Ch)

      onresize()

      var project = JSON.parse(window.api.readFile(filePath))
      extensions = project.extensions
      codeLanguage = project.codeLanguage
      extensions.forEach((element) => {
        eval(window.api.readFile(element))
      })

      workspace.updateToolbox(toolbox)
      startTransition(() => {
        Blockly.serialization.workspaces.load(project.workspace, workspace)
      })
    }

    initializeBlockly()

    return () => {
      window.removeEventListener('resize', onresize, false)
    }
  }, [])

  function showLoading() {
    loadingRoot.render(
      <div style={{ width: '100%', height: '100%', background: 'red' }}>
        <div
          style={{
            margin: '0',
            width: '50%',
            top: '50%',
            left: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <h1>{t('loading')}</h1>
          <ProgressBar />
        </div>
      </div>
    )
    document.getElementById('loading').hidden = false
  }

  function hideLoading() {
    loadingRoot.render(null)
    document.getElementById('loading').hidden = true
  }

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
        getDirectory(filePath) +
          '/' +
          getFileNameWithoutExtension(filePath) +
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
    <FluentProvider theme={webDarkTheme}>
      <Toaster
        toasterId={toasterId}
        position="top-end"
        pauseOnHover
        pauseOnWindowBlur
        timeout={1000}
      />
      <div
        id="loading"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999
        }}
        hidden
      ></div>
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
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
//window.removeEventListener('wheel', handleStopWheel)

function getFileNameWithoutExtension(filePath) {
  // 获取文件名
  const fileName = getFileName(filePath)

  // 查找最后一个点号的位置
  const lastDotIndex = fileName.lastIndexOf('.')

  // 如果没有找到点号，则返回整个文件名
  if (lastDotIndex === -1) {
    return fileName
  }

  // 提取文件名（不包含扩展名）
  return fileName.substring(0, lastDotIndex)
}

function getFileName(filePath) {
  // 查找最后一个斜杠的位置
  const lastSlashIndex = filePath.lastIndexOf('/')
  // 查找最后一个反斜杠的位置
  const lastBackslashIndex = filePath.lastIndexOf('\\')
  // 找到最后一个斜杠或反斜杠的位置
  const lastSeparatorIndex = Math.max(lastSlashIndex, lastBackslashIndex)

  // 如果没有找到斜杠或反斜杠，则文件名就是整个路径
  if (lastSeparatorIndex === -1) {
    return filePath
  }

  // 提取文件名
  return filePath.substring(lastSeparatorIndex + 1)
}

function getDirectory(filePath) {
  // 查找最后一个斜杠的位置
  const lastSlashIndex = filePath.lastIndexOf('/')
  // 查找最后一个反斜杠的位置
  const lastBackslashIndex = filePath.lastIndexOf('\\')
  // 找到最后一个斜杠或反斜杠的位置
  const lastSeparatorIndex = Math.max(lastSlashIndex, lastBackslashIndex)

  // 如果没有找到斜杠或反斜杠，则返回空字符串
  if (lastSeparatorIndex === -1) {
    return ''
  }

  // 提取目录部分
  return filePath.substring(0, lastSeparatorIndex)
}
