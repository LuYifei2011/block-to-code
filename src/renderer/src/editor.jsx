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

import React from 'react'
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
  Input
} from '@fluentui/react-components'
import { OpenFolder24Regular } from '@fluentui/react-icons'

const App = () => {
  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)

  const paramsStr = window.location.search
  const params = new URLSearchParams(paramsStr)
  var filePath = params.get('file') || ''

  var workspace
  var codeLanguage
  var extensions
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
    Blockly.serialization.workspaces.load(project.workspace, workspace)

    return () => {
      window.removeEventListener('resize', onresize, false)
    }
  }, [])

  function undo() {
    workspace.undo(false)
  }

  function redo() {
    workspace.undo(true)
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

  function open() {
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

  return (
    <FluentProvider theme={webDarkTheme}>
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
              <MenuItem onClick={open}>{t('open')}</MenuItem>
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
            </MenuList>
          </MenuPopover>
        </Menu>
        <Button onClick={buildCode}>{t('build')}</Button>
        <Button>{t('run')}</Button>
        <AddExtensions />
      </div>
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
