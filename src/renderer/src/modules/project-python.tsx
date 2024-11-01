import Project from "./project";

export class PythonProject extends Project {
    getInfo(): any {
        return {
            id: 'python',
            name: 'Project Name',
            version: '1.0.0'
        };
    }

    createNew(): any {
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