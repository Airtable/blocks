// @flow

export interface BlocksDevCredentialsInterface {
    // eslint-disable-next-line flowtype/object-type-delimiter
    getDeveloperCredentialByNameIfExists(): {[string]: string} | null;
}
