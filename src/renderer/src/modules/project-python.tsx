import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useBlocklyWorkspace } from '../hooks/useBlocklyWorkspace'; // 修改导入路径
import { getToolbox } from '../toolbox';
import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from '@fluentui/react-components';
import { CodeRegular } from '@fluentui/react-icons';
import { Highlight, themes } from 'prism-react-renderer';
import { pythonGenerator } from 'blockly/python';
import * as Blockly from 'blockly/core';
import '../assets/img/block.svg';
import BlockIcon from '../assets/img/block.svg';
import { log } from 'console';

const PythonProject: React.FC = forwardRef((props, ref) => {
    const blocklyRef = useRef(null);
    const [xml] = useState('');

    const [selectedValue, setSelectedValue] = useState<TabValue>('blocks');
    const [activeWorkspace, setActiveWorkspace] = useState<Blockly.Workspace | undefined>(undefined);

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
        setActiveWorkspace(data.value === 'blocks' ? workspace : undefined);
    };

    const { workspace } = useBlocklyWorkspace({
        ref: blocklyRef,
        toolboxConfiguration: getToolbox(), // this must be a JSON toolbox definition
        initialXml: xml,
        onWorkspaceChange: (workspace) => {
            setActiveWorkspace(workspace);
        },
    });


    const getInfo = () => {
        return {
            id: 'python',
            name: 'Python',
            version: '1.0.0',
            extensionName: 'py',
        };
    };

    const createNew = () => {
        return {};
    };

    const load = (data: any) => {
        Blockly.serialization.workspaces.load(data, workspace);
    };

    const save = (): any => {
        return Blockly.serialization.workspaces.save(workspace);
    };

    const generateCode = () => {
        return '#!/usr/bin/env python3\n' + pythonGenerator.workspaceToCode(workspace);
    };

    const run = () => {};

    useImperativeHandle(ref, () => ({
        activeWorkspace,
        load,
        save,
        getInfo,
        createNew,
        generateCode,
        run,
    }));
   
    useEffect(()=>{

    },[])

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} style={{ marginBottom: '0px' }}>
                <Tab id="Blocks" icon={<img src={BlockIcon} style={{ height: '16px', width: '16px' }} />} value="blocks">
                    Blocks
                </Tab>
                <Tab id="Code" icon={<CodeRegular />} value="code">
                    Code
                </Tab>
            </TabList>
            <div style={{ height: `calc(100vh - 76px)`, overflow: 'auto' }}>
                <div style={{ display: selectedValue === 'blocks' ? 'block' : 'none', height: '100%', width: '100%' }}>
                    <div ref={blocklyRef} style={{ height: '100%', width: '100%' }} />
                </div>
                {selectedValue === 'code' && (
                    <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                        <Highlight language="python" code={generateCode()} theme={themes.dracula}>
                            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                <pre className={className} style={{ ...style, padding: '10px', backgroundColor: '#282a36', overflowX: 'auto' }}>
                                    {tokens.map((line, i) => (
                                        <div key={i} {...getLineProps({ line })} style={{ display: 'table-row' }}>
                                            <span style={{ display: 'table-cell', textAlign: 'right', paddingRight: '1em', userSelect: 'none', opacity: 0.5 }}>
                                                {i + 1}
                                            </span>
                                            <span style={{ display: 'table-cell' }}>
                                                {line.map((token, key) => (
                                                    <span key={key} {...getTokenProps({ token })} />
                                                ))}
                                            </span>
                                        </div>
                                    ))}
                                </pre>
                            )}
                        </Highlight>
                    </div>
                )}
            </div>
        </div>
    );
});

export default PythonProject;
