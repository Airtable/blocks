import getSdk from './get_sdk';
import {ObjectMap} from './private_utils';

const usedWarnings: ObjectMap<string, true> = {};

export default (msg: string) => {
    if (getSdk().runInfo.isDevelopmentMode && usedWarnings[msg] !== true) {
        usedWarnings[msg] = true;

        // eslint-disable-next-line no-console
        console.warn(`[@airtable/blocks] ${msg}`);
    }
};
