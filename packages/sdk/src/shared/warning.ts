import {SdkMode} from '../sdk_mode';
import {ObjectMap} from './private_utils';
import {BlockSdkCore} from './sdk_core';

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

export function __injectSdkIntoWarning(_sdk: BlockSdkCore<SdkMode>) {
    sdk = _sdk;
}
