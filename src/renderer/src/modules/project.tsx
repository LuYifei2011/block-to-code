import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useBlocklyWorkspace } from 'react-blockly';
import { getToolbox } from '../toolbox'
import DarkTheme from '@blockly/theme-dark'
import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from '@fluentui/react-components';
import { CodeRegular } from '@fluentui/react-icons'
import { Highlight, themes } from "prism-react-renderer"
import { javascriptGenerator } from 'blockly/javascript';
import '../assets/img/block.svg';
import BlockIcon from '../assets/img/block.svg';

const Project: React.FC = forwardRef((props, ref) => {
    const blocklyRef = useRef(null);
    const [xml] = useState('');

    const [selectedValue, setSelectedValue] =
        React.useState<TabValue>("blocks");
    const [activeWorkspace, setActiveWorkspace] = useState();
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
    });

    const getInfo = () => {
        return {
            id: 'project-id',
            name: 'Project Name',
            version: '1.0.0'
        };
    };

    const createNew = () => {
        return {};
    }

    const load = (data: any) => {

    }

    const save = () => {

    }

    const generateCode = () => {
        return javascriptGenerator.workspaceToCode(workspace);
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
                {selectedValue === "code" && <Highlight theme={themes.shadesOfPurple} language='javascript'>{generateCode()}</Highlight>}
            </div>
        </div>
    );
});

export default Project;