import { Extension } from './extension';

export class Extensions{
    getInfo(extension: string): any{
        return Function('API.Extensions.register', extension)(function(extension: Extension){
            return extension.getInfo();
        })
    }

    Load(extension: string): void{
        let ext = Function('API.Extensions.register', extension)(function(extension: Extension){
            return extension;
        })
        // TODO: Load the extension
    }

    // TODO: Unload the extension
}