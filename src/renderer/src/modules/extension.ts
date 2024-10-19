export interface Extension {
    getInfo(): any;
    getMsgs(lang: string): Map<string, string>;
    getBlocks(): any;
    initBlocks(Extensions: any): void;
    initGenerators(Generate: any, Order: any, lang: string): void;
    getToolbox(): any;
}