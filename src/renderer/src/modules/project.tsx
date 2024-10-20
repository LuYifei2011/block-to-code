import React, { ReactElement, useState } from "react";
import ReactDOM from 'react-dom/client';
import { TabList, Tab } from "@fluentui/react-components";
import type {
    SelectTabData,
    SelectTabEvent,
    TabValue,
} from "@fluentui/react-components";

export class Project {
    mainDiv: HTMLDivElement;
    private tabs: ReactElement[] = [];
    const [selectedValue, setSelectedValue] =
    React.useState<TabValue>("conditions");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    constructor(mainDiv: HTMLDivElement) {
        this.mainDiv = mainDiv;
    }

    private initializeTab(): void {
        this.tabs = [];
        this.renderTabs();
    }

    private newTab(value: string, content: string): void {
        const newTabElement = <Tab value={value} content={content} />;
        this.tabs.push(newTabElement);
        this.renderTabs();
    }

    private renderTabs(): void {
        const tabList = (
            <TabList selectedValue={this.tabs[0]? this.tabs[0].props.value : ""}>
                {this.tabs}
            </TabList>
        );
        ReactDOM.createRoot(this.mainDiv).render(tabList);
    }

    getInfo(): any {
        return {
            id: 'project-id',
            name: 'Project Name',
            version: '1.0.0'
        };
    }

    codePreview(): void {
        // TODO: Implement code preview
    }

    initWorkspace(): void {
        // TODO: Inject workspace initialization code
        // TODO: Load Msg
        // TODO: Load Plugin
    }

    initTab(): void {
        this.initializeTab();
        this.newTab("Blocks", "Blocks");
        this.initWorkspace();
        this.codePreview();
    }

    load(data: any): void {
        this.initTab();
    }

    save(): any {
        // TODO: Save project
        return {};
    }

    new(): any {
        // TODO: Create new project
        return {};
    }

    generateCode(): string {
        // TODO: Generate code for project
        return "";
    }

    run(): void {
        // TODO: Run project
    }
}
