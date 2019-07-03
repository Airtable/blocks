// flow-typed signature: 17036dab07d91f461bbf36a1b21e89aa
// flow-typed version: <<STUB>>/clipboardy_v2.x.x/flow_v0.98.1

declare module 'clipboardy' {
    declare module.exports: {
        write(text: string): Promise<void>,
        writeSync(text: string): void,
        read(): Promise<string>,
        readSync(): string,
    };
}
