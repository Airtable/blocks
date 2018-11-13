// @flow
const getSdk = require('block_sdk/shared/get_sdk');

const usedWarnings = {};
module.exports = (msg: string) => {
    if (getSdk().runInfo.isDevelopmentMode && usedWarnings[msg] !== true) {
        usedWarnings[msg] = true;

        // eslint-disable-next-line no-console
        console.warn(`[airtable-block] ${msg}`);
    }
};
