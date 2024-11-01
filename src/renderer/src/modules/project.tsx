import React, { useState, useEffect, ReactElement, useRef } from "react";
import ReactDOM from 'react-dom/client';
import { TabList, Tab } from "@fluentui/react-components";
import type { SelectTabData, SelectTabEvent, TabValue } from "@fluentui/react-components";
import DarkTheme from '@blockly/theme-dark'
import 'blockly/blocks'
import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'
import { pythonGenerator } from 'blockly/python'
import * as Ch from 'blockly/msg/zh-hans'
import { getToolbox } from '../toolbox.js';

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            selectedValue: "conditions"
        };
    }

    onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        this.setState({ selectedValue: data.value });
    };

    componentDidMount() {
        this.initializeTab();
    }

    initializeTab = () => {
        this.setState({ tabs: [] });
        this.renderTabs();
    };

    newTab = (value: string, content: string) => {
        const newTabElement = <Tab key={value} value={value} content={content} />;
        this.setState(prevState => ({ tabs: [...prevState.tabs, newTabElement] }), this.renderTabs);
    };

    renderTabs = () => {
        const tabList = (
            <TabList selectedValue={this.state.tabs[0] ? this.state.tabs[0].props.value : ""} onTabSelect={this.onTabSelect}>
                {this.state.tabs}
            </TabList>
        );
        const mainDiv = this.props.mainDiv;
        if (mainDiv) {
            ReactDOM.createRoot(mainDiv).render(tabList);
        } else {
            console.error("mainDiv is not defined");
        }
    };

    getInfo = () => {
        return {
            id: 'project-id',
            name: 'Project Name',
            version: '1.0.0'
        };
    };

    codePreview = () => {
        // TODO: Implement code preview
    };

    initWorkspace = () => {
        const mainDiv = this.props.mainDiv;
        if (!mainDiv) {
            console.error("mainDiv is not defined");
            return;
        }

        const blocklyArea = document.createElement('div');
        blocklyArea.id = 'blocklyArea';
        blocklyArea.style.position = 'absolute';
        blocklyArea.style.top = '0';
        blocklyArea.style.bottom = '0';
        blocklyArea.style.left = '0';
        blocklyArea.style.right = '0';
        mainDiv.appendChild(blocklyArea);

        const blocklyDiv = document.createElement('div');
        blocklyDiv.id = 'blocklyDiv';
        blocklyDiv.style.position = 'absolute';
        blocklyDiv.style.top = '0';
        blocklyDiv.style.bottom = '0';
        blocklyDiv.style.left = '0';
        blocklyDiv.style.right = '0';
        mainDiv.appendChild(blocklyDiv);

        const workspace = Blockly.inject(blocklyDiv, {
            toolbox: getToolbox(),
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
        });

        const onresize = function () {
            var element = blocklyArea;
            var x = 0;
            var y = 0;
            do {
                x += element.offsetLeft;
                y += element.offsetTop;
                element = element.offsetParent;
            } while (element);
            blocklyDiv.style.left = x + 'px';
            blocklyDiv.style.top = y + 'px';
            blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
            blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
            Blockly.svgResize(workspace);
        };
        window.addEventListener('resize', onresize, false);
        Blockly.setLocale(Ch);
        onresize();
    };

    initTab = () => {
        //this.initializeTab();
        //this.newTab("Blocks", "Blocks");
        this.initWorkspace();
        //this.codePreview();
    };

    load = (data: any) => {
        this.initTab();
    };

    save = () => {
        // TODO: Save project
        return {};
    };

    createNew = () => {
        // TODO: Create new project
        return {};
    };

    generateCode = () => {
        // TODO: Generate code for project
        return "";
    };

    run = () => {
        // TODO: Run project
    };

    getWorkspace(): Blockly.WorkspaceSvg | undefined {
        return Blockly.getMainWorkspace();
    }

    render() {
        return (
            <div>
                {/* Your component JSX structure */}
            </div>
        );
    }
}

export default Project;