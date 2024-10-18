import Blockly from 'blockly';

export interface Extension{
    getInfo() : any;
    getMag(language : string) : any;
    getBlocks() : any;
    initBlocks(language : string, generator : any, order : any) : void;
    initGenerators() : void;
    getToolbox() : any;
}

export class Extensions {
    workspace : Blockly.WorkspaceSvg;
    extensions : any[];

    constructor(workspace : Blockly.WorkspaceSvg) {
        this.workspace = workspace;
        this.extensions = [];
    }

    register(extension : any) {
        
    }
}