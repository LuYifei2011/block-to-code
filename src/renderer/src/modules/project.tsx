import React, { useState, useEffect, ReactElement, useRef } from "react";
import ReactDOM from 'react-dom/client';
import { TabList, Tab } from "@fluentui/react-components";
import type { SelectTabData, SelectTabEvent, TabValue } from "@fluentui/react-components";

const ProjectComponent = React.forwardRef(({ mainDiv }: { mainDiv: HTMLDivElement }, ref) => {
    const [tabs, setTabs] = useState<ReactElement[]>([]);
    const [selectedValue, setSelectedValue] = useState<TabValue>("conditions");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    useEffect(() => {
        initializeTab();
    }, []);

    const initializeTab = () => {
        setTabs([]);
        renderTabs();
    };

    const newTab = (value: string, content: string) => {
        const newTabElement = <Tab key={value} value={value} content={content} />;
        setTabs(prevTabs => [...prevTabs, newTabElement]);
        renderTabs();
    };

    const renderTabs = () => {
        const tabList = (
            <TabList selectedValue={tabs[0] ? tabs[0].props.value : ""} onTabSelect={onTabSelect}>
                {tabs}
            </TabList>
        );
        ReactDOM.createRoot(mainDiv).render(tabList);
    };

    const getInfo = () => {
        return {
            id: 'project-id',
            name: 'Project Name',
            version: '1.0.0'
        };
    };

    const codePreview = () => {
        // TODO: Implement code preview
    };

    const initWorkspace = () => {
        // TODO: Inject workspace initialization code
        // TODO: Load Msg
        // TODO: Load Plugin
    };

    const initTab = () => {
        initializeTab();
        newTab("Blocks", "Blocks");
        initWorkspace();
        codePreview();
    };

    const load = (data: any) => {
        initTab();
    };

    const save = () => {
        // TODO: Save project
        return {};
    };

    const createNew = () => {
        // TODO: Create new project
        return {};
    };

    const generateCode = () => {
        // TODO: Generate code for project
        return "";
    };

    const run = () => {
        // TODO: Run project
    };

    // Expose methods to parent component
    React.useImperativeHandle(ref, () => ({
        load,
        save,
        createNew,
        generateCode,
        run,
        getInfo,
        codePreview,
        initWorkspace,
        initTab,
    }));

    return (
        <div>
            {/* Your component JSX structure */}
        </div>
    );
});

export default ProjectComponent;