// @flow
const getSdk = require('block_sdk/shared/get_sdk');
const invariant = require('invariant');

import type FrontendBlockSdk from 'block_sdk/frontend/sdk';

function getFrontendSdk(): FrontendBlockSdk {
    invariant(typeof window !== 'undefined', 'Should only call getFrontendSdk from the frontend');
    const sdk = getSdk();
    return ((sdk: any): FrontendBlockSdk); // eslint-disable-line flowtype/no-weak-types
}

module.exports = getFrontendSdk;
