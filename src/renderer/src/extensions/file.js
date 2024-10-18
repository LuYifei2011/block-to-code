class Files {
  getInfo() {
    return {
      name: '文件',
      id: 'files',
      author: 'LuYifei2011',
      version: '1.0.0',
      description: '文件操作相关的块',
      licence: 'MIT',
      language: ['Python']
    }
  }

  getMsg(language) {
    switch (language) {
      case 'zh-hans':
        return {
          EXT_FILES_HUE: '42',
          EXT_FILES: '文件'
        }
      default:
        return {
          EXT_FILES_HUE: '42',
          EXT_FILES: 'Files'
        }
    }
  }

  getBlocks() {
    return [
      {
        type: 'files_open',
        tooltip: '',
        helpUrl: '',
        message0: '打开文件 %1',
        args0: [
          {
            type: 'input_value',
            name: 'file',
            check: 'String'
          }
        ],
        output: 'file',
        colour: '%{BKY_EXT_FILES_HUE}',
        inputsInline: true,
        mutator: 'files_open_mutator'
      },
      {
        type: 'files_open_container',
        tooltip: '',
        helpUrl: '',
        message0:
          '打开模式 %1 %2 缓冲 %3 %4 编码 %5 %6 报错级别 %7 %8 换行符 %9 %10 传入的file参数类型 %11 %12 自定义开启器 %13 %14',
        args0: [
          {
            type: 'field_checkbox',
            name: 'mode',
            checked: 'FALSE'
          },
          {
            type: 'input_dummy',
            name: 'mode'
          },
          {
            type: 'field_checkbox',
            name: 'buffering',
            checked: 'FALSE'
          },
          {
            type: 'input_dummy',
            name: 'buffering'
          },
          {
            type: 'field_checkbox',
            name: 'encoding',
            checked: 'FALSE'
          },
          {
            type: 'input_dummy',
            name: 'encoding'
          },
          {
            type: 'field_checkbox',
            name: 'errors',
            checked: 'FALSE'
          },
          {
            type: 'input_dummy',
            name: 'errors'
          },
          {
            type: 'field_checkbox',
            name: 'newline',
            checked: 'FALSE'
          },
          {
            type: 'input_dummy',
            name: 'newline'
          },
          {
            type: 'field_checkbox',
            name: 'closefd',
            checked: 'FALSE'
          },
          {
            type: 'input_dummy',
            name: 'closefd'
          },
          {
            type: 'field_checkbox',
            name: 'opener',
            checked: 'FALSE'
          },
          {
            type: 'input_dummy',
            name: 'opener'
          }
        ],
        colour: '%{BKY_EXT_FILES_HUE}'
      },
      {
        type: 'files_open_mode',
        tooltip: '',
        helpUrl: '',
        message0: '%1 ，读写 %2 ，二进制 %3 %4',
        args0: [
          {
            type: 'field_dropdown',
            name: 'mode',
            options: [
              ['读', 'r'],
              ['写', 'w'],
              ['追加', 'a']
            ]
          },
          {
            type: 'field_checkbox',
            name: 'p',
            checked: 'FALSE'
          },
          {
            type: 'field_checkbox',
            name: 'b',
            checked: 'FALSE'
          },
          {
            type: 'input_dummy',
            name: 'mode'
          }
        ],
        output: 'String',
        colour: '%{BKY_EXT_FILES_HUE}'
      }
    ]
  }

  initBlocks() {
    Blockly.Extensions.registerMutator(
      'files_open_mutator',
      {
        saveExtraState: function () {
          return {
            mode: this.mode_,
            buffering: this.buffering_,
            encoding: this.encoding_,
            errors: this.errors_,
            newline: this.newline_,
            closefd: this.closefd_,
            opener: this.opener_
          }
        },
        loadExtraState: function (state) {
          this.mode_ = state['mode']
          this.buffering_ = state['buffering']
          this.encoding_ = state['encoding']
          this.errors_ = state['errors']
          this.newline_ = state['newline']
          this.closefd_ = state['closefd']
          this.opener_ = state['opener']

          this.updateShape_()
        },
        decompose: function (workspace) {
          const topBlock = workspace.newBlock('files_open_container')

          topBlock.initSvg()

          topBlock.setFieldValue(this.mode_, 'mode')
          topBlock.setFieldValue(this.buffering_, 'buffering')
          topBlock.setFieldValue(this.encoding_, 'encoding')
          topBlock.setFieldValue(this.errors_, 'errors')
          topBlock.setFieldValue(this.newline_, 'newline')
          topBlock.setFieldValue(this.closefd_, 'closefd')
          topBlock.setFieldValue(this.opener_, 'opener')

          return topBlock
        },
        compose: function (topBlock) {
          this.mode_ = topBlock.getFieldValue('mode')
          this.buffering_ = topBlock.getFieldValue('buffering')
          this.encoding_ = topBlock.getFieldValue('encoding')
          this.errors_ = topBlock.getFieldValue('errors')
          this.newline_ = topBlock.getFieldValue('newline')
          this.closefd_ = topBlock.getFieldValue('closefd')
          this.opener_ = topBlock.getFieldValue('opener')

          this.updateShape_()
        },
        updateShape_: function () {
          if (this.mode_ == 'TRUE') {
            if (!this.getInput('mode')) {
              var shadowBlock = Blockly.utils.xml.textToDom(
                '<xml><shadow type="files_open_mode"/></xml>'
              ).children[0]
              this.appendValueInput('mode')
                .setCheck('String')
                .appendField('模式')
                .setShadowDom(shadowBlock)
            }
          } else {
            if (this.getInput('mode')) {
              this.removeInput('mode')
            }
          }
        }
      },
      undefined,
      []
    )
  }

  initGenerators(language, generator, order) {
    generator.forBlock['files_open'] = function (block, generator) {
      const value_file = generator.valueToCode(block, 'file', order.ATOMIC)
      let mode
      let buffering
      let encoding
      let errors
      let newline
      let closefd
      let opener
      try {
        mode = generator.valueToCode(block, 'mode', order.ATOMIC)
      } catch (e) {}
      try {
        buffering = generator.valueToCode(block, 'buffering', order.ATOMIC)
      } catch (e) {}
      try {
        encoding = generator.valueToCode(block, 'encoding', order.ATOMIC)
      } catch (e) {}
      try {
        errors = generator.valueToCode(block, 'errors', order.ATOMIC)
      } catch (e) {}
      try {
        newline = generator.valueToCode(block, 'newline', order.ATOMIC)
      } catch (e) {}
      try {
        closefd = generator.valueToCode(block, 'closefd', order.ATOMIC)
      } catch (e) {}
      try {
        opener = generator.valueToCode(block, 'opener', order.ATOMIC)
      } catch (e) {}

      const code = `open(${value_file + (mode ? ', ' + mode : '')})`
      return [code, order.NONE]
    }

    generator.forBlock['files_open_mode'] = function (block) {
      const dropdown_mode = block.getFieldValue('mode')
      const checkbox_p = block.getFieldValue('p')
      const checkbox_b = block.getFieldValue('b')

      const code = `'${dropdown_mode + (checkbox_b == 'TRUE' ? 'b' : '') + (checkbox_p == 'TRUE' ? '+' : '')}'`
      return [code, order.ATOMIC]
    }
  }

  getToolbox() {
    return {
      kind: 'category',
      name: '%{BKY_EXT_FILES}',
      colour: '%{BKY_EXT_FILES_HUE}',
      contents: [
        {
          kind: 'block',
          type: 'files_open',
          inputs: {
            file: {
              shadow: {
                type: 'text',
                fields: {
                  TEXT: 'D:\\test.txt'
                }
              }
            }
          }
        }
      ]
    }
  }
}

API.Extensions.register(new Files())
