import * as Blockly from "blockly";
import Project from "./project";
import { PythonProject } from "./project-python";
import ReactDOM from 'react-dom/client'

export class Workspaces {
    root: ReactDOM.Root;

    constructor(mainDiv: HTMLDivElement) {
        this.root = ReactDOM.createRoot(mainDiv);
    }

    load(data: any): void {
        switch (data.type) {
            case "python":
                this.root.render(<Project />);
                // this.project.load(data.data);
                break;
            default:
                console.error("Unsupported project type: " + data.type);
                break;
        }
    }

    save(): any {
        // return {
        //     type: this.project.getInfo().id,
        //     data: this.project.save()
        // };
    }

    getActiveWorkspace(): Blockly.WorkspaceSvg | undefined {
        // return this.project.getWorkspace();
    }
}