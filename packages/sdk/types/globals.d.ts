interface Window {
    __requirePrivateModuleFromAirtable(moduleName: string): any;
}

declare namespace NodeJS {
    interface Global {
        readonly PACKAGE_NAME: string;
        readonly PACKAGE_VERSION: string;
    }
}
