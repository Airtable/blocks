// @flow

class BlockDeveloperCredentials {
    _developerCredentialByName: {[string]: string};
    constructor(
        developerCredentialByName: {[string]: string},
    ) {
        this._developerCredentialByName = developerCredentialByName;
    }

    get(name: string): string | void {
        return this._developerCredentialByName[name];
    }
}

module.exports = BlockDeveloperCredentials;
