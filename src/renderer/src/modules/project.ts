export class Project {
    getInfo(): any {
        return {
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
        // TODO: Inject tab initialization code
        // initWorkspace()
        // codePreview()
    }

    Load(data: any) {
        // TODO: Load project
        // initTab()
    }

    Save(): any {
        // TODO: Save project
        return {};
    }

    New(): any {
        // TODO: Create new project
        return {};
    }

    GenerateCode(): string {
        // TODO: Generate code for project
        return "";
    }

    Run(): void {
        // TODO: Run project
    }
}