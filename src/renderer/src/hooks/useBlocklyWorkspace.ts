import { useBlocklyWorkspace as originalUseBlocklyWorkspace } from 'react-blockly';
import { useEffect, useState } from 'react';
import * as Blockly from 'blockly/core';
import DarkTheme from '@blockly/theme-dark';
import * as Ch from 'blockly/msg/zh-hans';

export const useBlocklyWorkspace = (config) => {
    const [workspace, setWorkspace] = useState<Blockly.Workspace | undefined>(undefined);

    const { workspace: originalWorkspace } = originalUseBlocklyWorkspace({
        ...config,
        workspaceConfiguration: {
            grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
            },
            trashcan: true,
            theme: DarkTheme,
            media: '/src/assets/blockly/media/',
        },
        onWorkspaceChange: (workspace) => {
            setWorkspace(workspace);
            if (config.onWorkspaceChange) {
                config.onWorkspaceChange(workspace);
            }
        },
    });

    useEffect(() => {
        Blockly.setLocale(Ch);
        Blockly.Msg.CATLOGIC = "逻辑";
        Blockly.Msg.CATLOOPS = "循环";
        Blockly.Msg.CATMATH = "数学";
        Blockly.Msg.CATTEXT = "文本";
        Blockly.Msg.CATLISTS = "列表";
        Blockly.Msg.CATCOLOUR = "颜色";
        Blockly.Msg.CATVARIABLES = "变量";
        Blockly.Msg.CATFUNCTIONS = "函数";

        Blockly.dialog.setAlert(function (message, callback) {
            console.log('Alert: ' + message);
        });

        Blockly.dialog.setConfirm(function (message, callback) {
            console.log('Confirm: ' + message);
        });

        Blockly.dialog.setPrompt(function (message, defaultValue, callback) {
            console.log('Prompt: ' + message);
        });

        setWorkspace(originalWorkspace);
    }, [originalWorkspace]);

    return { workspace };
};
