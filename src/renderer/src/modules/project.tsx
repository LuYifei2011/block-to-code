import React, { useRef, useState } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import { useBlocklyWorkspace } from 'react-blockly';
import { getToolbox } from '../toolbox'
import DarkTheme from '@blockly/theme-dark'
import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from '@fluentui/react-components';
import { CodeRegular } from '@fluentui/react-icons'
import Highlight from 'react-highlight'
import { javascriptGenerator } from 'blockly/javascript';
import 'highlight.js/styles/atom-one-dark.css';
import '../assets/img/block.svg';
import BlockIcon from '../assets/img/block.svg';

const Project: React.FC = () => {
    const blocklyRef = useRef(null);
    const [xml] = useState('');

    const [selectedValue, setSelectedValue] =
        React.useState<TabValue>("blocks");
    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
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
    });
    
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
                {selectedValue === "code" && <Highlight language='javascript'>{javascriptGenerator.workspaceToCode(workspace)}</Highlight>}
            </div>
        </div>
    );
};

export default Project;