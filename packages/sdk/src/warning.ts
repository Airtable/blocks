import {ObjectMap} from './private_utils';
import {BlockSdkCore} from './shared/sdk_core';
import {SdkMode} from './sdk_mode';

const usedWarnings: ObjectMap<string, true> = {};

export default (msgLines: string | Array<string>) => {
    const msg = typeof msgLines === 'string' ? msgLines : msgLines.join('\n');
    const mayUseConsole = !sdk || sdk.runInfo.isDevelopmentMode;
    if (mayUseConsole && usedWarnings[msg] !== true) {
        usedWarnings[msg] = true;

        // eslint-disable-next-line no-console
        console.warn(`[@airtable/blocks] ${msg}`);
    }
};

let sdk: BlockSdkCore<SdkMode>;

// The application-level Sdk instance must be injected dynamically to avoid
// circular dependencies at the time of module resolution.
export function __injectSdkIntoWarning(_sdk: BlockSdkCore<SdkMode>) {
    sdk = _sdk;
}
