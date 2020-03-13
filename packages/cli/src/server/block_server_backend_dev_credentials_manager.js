// @flow
import type {BlocksDevCredentialsInterface} from '../types/blocks_dev_credentials_interface';

class BlockServerBackendDevCredentialsManager implements BlocksDevCredentialsInterface {
    _devCredentialByNameIfExists: {[string]: string} | null;

    constructor(localPathIfExists: string | null) {
        this._resolveDevCredentialByNameFromPathIfExists(localPathIfExists);
    }

    _resolveDevCredentialByNameFromPathIfExists(localPathIfExists: string | null): void {
        try {
            // flow-disable-next-line since this will be available as part of a Lambda layer
            this._devCredentialByNameIfExists = require(localPathIfExists);
        } catch {
            this._devCredentialByNameIfExists = null;
        }
    }

    getDeveloperCredentialByNameIfExists(): {[string]: string} | null {
        return this._devCredentialByNameIfExists;
    }
}

module.exports = BlockServerBackendDevCredentialsManager;
