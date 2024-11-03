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
        setWorkspace(originalWorkspace);
    }, [originalWorkspace]);

    return { workspace };
};
