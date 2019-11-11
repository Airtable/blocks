import getSdk from './dist/types/src/get_sdk';
declare const sdk: ReturnType<typeof getSdk>;

export const globalConfig: typeof sdk.globalConfig;
export const base: typeof sdk.base;
export const session: typeof sdk.session;
export const installationId: typeof sdk.installationId;
export const viewport: typeof sdk.viewport;
export const runInfo: typeof sdk.runInfo;
export const cursor: typeof sdk.cursor;
export const settingsButton: typeof sdk.settingsButton;
export const undoRedo: typeof sdk.undoRedo;
export const reload: typeof sdk.reload;
