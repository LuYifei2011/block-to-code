import * as Blockly from "blockly";

import Project from "./project";
import { Python } from "./projects/python";

export class Workspaces {
    project: Project;
    mainDiv: HTMLDivElement;

    constructor(mainDiv: HTMLDivElement) {
        this.mainDiv = mainDiv;
        this.project = new Project({ mainDiv });
    }

    load(data: any): void {
        switch (data.type) {
            case "python":
                this.project = new Python(this.mainDiv);
                this.project.load(data.data);
                break;
            default:
                console.error("Unsupported project type: " + data.type);
                break;
        }
    }

    save(): any {
        return {
            type: this.project.getInfo().id,
            data: this.project.save()
        };
    }

    getActiveWorkspace(): Blockly.WorkspaceSvg | undefined {
        return this.project.getWorkspace();
    }
}