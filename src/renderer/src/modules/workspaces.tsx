import * as Blockly from "blockly";
import Project from "./project";
import PythonProject from "./project-python";
import ReactDOM from 'react-dom/client'
import React from 'react';

export class Workspaces {
    root: ReactDOM.Root;
    projectRef: React.RefObject<any>;

    constructor(mainDiv: HTMLDivElement) {
        this.root = ReactDOM.createRoot(mainDiv);
        this.projectRef = React.createRef();
    }

    load(data: any): void {
        switch (data.type) {
            case "python":
                this.root.render(<PythonProject ref={this.projectRef} />);
                setTimeout(() => {
                    this.projectRef.current?.load(data.data);
                }, 100);
                break;
            default:
                console.error("Unsupported project type: " + data.type);
                break;
        }
    }

    save(): any {
        if (this.projectRef.current) {
            return {
                type: this.projectRef.current.getInfo().id,
                data: this.projectRef.current.save()
            };
        }
    }

    getActiveWorkspace(): Blockly.WorkspaceSvg | undefined {
        return this.projectRef.current?.activeWorkspace;
    }

    getInfo() {
        return this.projectRef.current?.getInfo();
    }

    createNew() {
        return this.projectRef.current?.createNew();
    }

    generateCode() {
        return this.projectRef.current?.generateCode();
    }

    run() {
        return this.projectRef.current?.run();
    }
}