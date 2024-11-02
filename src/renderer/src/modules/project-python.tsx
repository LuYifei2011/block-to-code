import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useBlocklyWorkspace } from 'react-blockly';
import { getToolbox } from '../toolbox'
import DarkTheme from '@blockly/theme-dark'
import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from '@fluentui/react-components';
import { CodeRegular } from '@fluentui/react-icons'
import Highlight from 'react-highlight'
import { pythonGenerator } from 'blockly/python';
import * as Blockly from 'blockly/core'
import 'highlight.js/styles/atom-one-dark.css';
import '../assets/img/block.svg';
import BlockIcon from '../assets/img/block.svg';

const PythonProject: React.FC = forwardRef((props, ref) => {
    const blocklyRef = useRef(null);
    const [xml] = useState('');

    const [selectedValue, setSelectedValue] =
        React.useState<TabValue>("blocks");
    const [activeWorkspace, setActiveWorkspace] = useState<Blockly.Workspace | undefined>(undefined);

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
        setActiveWorkspace(data.value === "blocks" ? workspace : undefined);
    }

    const { workspace } = useBlocklyWorkspace({
        ref: blocklyRef,
        toolboxConfiguration: getToolbox(), // this must be a JSON toolbox definition
        initialXml: xml,
        workspaceConfiguration: {
            grid: {
                spacing: 20,
                length: 3,
                colour: "#ccc",
                snap: true,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            },
            trashcan: true,
            theme: DarkTheme,
            media: '/src/assets/blockly/media/',
        },
        onWorkspaceChange: (workspace) => {
            setActiveWorkspace(workspace);
        }
    });

    const getInfo = () => {
        return {
            id: 'python',
            name: 'Python',
            version: '1.0.0',
            extensionName: 'py'
        };
    };

    const createNew = () => {
        return {};
    }

    const load = (data: any) => {
        Blockly.serialization.workspaces.load(data, workspace);
    }

    const save = (): any => {
        return Blockly.serialization.workspaces.save(workspace);
    }

    const generateCode = () => {
        return '#!/usr/bin/env python3\n' + pythonGenerator.workspaceToCode(workspace);
    }

    const run = () => {

    }

    useImperativeHandle(ref, () => ({
        activeWorkspace,
        load,
        save,
        getInfo,
        createNew,
        generateCode,
        run
    }));
    
    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab id="Blocks" icon={<img src={BlockIcon} style={{ height: '16px', width: '16px' }} />} value="blocks">
                    Blocks
                </Tab>
                <Tab id="Code" icon={<CodeRegular />} value="code">
                    Code
                </Tab>
            </TabList>
            <div style={{ flex: 1 }}>
                <div style={{ display: selectedValue === "blocks" ? 'block' : 'none', height: '100%', width: '100%' }}>
                    <div ref={blocklyRef} style={{ height: '100%', width: '100%' }} />
                </div>
                {selectedValue === "code" && <Highlight language='javascript'>{generateCode()}</Highlight>}
            </div>
        </div>
    );
});

export default PythonProject;