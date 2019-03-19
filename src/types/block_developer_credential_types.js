// @flow

export type BlockDeveloperCredentialEncrypted = {|
    id?: string, // optional for new developer credentials.
    name: string,
    revision: number,
    kmsDataKeyId: string,
    developmentCredentialValueEncrypted: string | null,
    releaseCredentialValueEncrypted: string | null,
|};
