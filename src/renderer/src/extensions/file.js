Blockly.Msg.EXT_FILE_HUE = '42'
Blockly.defineBlocksWithJsonArray([
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
    colour: '%{BKY_EXT_FILE_HUE}',
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
    colour: 225
  }
])

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
          var shadowBlock = document.createElement('block')
          shadowBlock.setAttribute('type', 'text')
          this.appendValueInput('mode').setCheck('String').appendField('模式').setShadowDom(shadowBlock)
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

pythonGenerator.forBlock['files_open'] = function (block, generator) {
  const value_file = generator.valueToCode(block, 'file', Order.ATOMIC)
  const code = `open(${value_file})`
  return [code, Order.NONE]
}

toolbox.contents.push({
  kind: 'category',
  name: 'Files',
  colour: '%{BKY_EXT_FILE_HUE}',
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
        // mode: {
        //   shadow:{
        //     type: 'text',
        //     fields: {
        //       TEXT: 'r'
        //     }
        //   }
        // }
      }
    }
  ]
})
