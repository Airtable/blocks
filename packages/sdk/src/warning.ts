import {ObjectMap} from './private_utils';
import Sdk from './sdk';

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

let sdk: Sdk;

export function __injectSdkIntoWarning(_sdk: Sdk) {
    sdk = _sdk;
}
