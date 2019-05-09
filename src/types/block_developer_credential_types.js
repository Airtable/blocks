// @flow

export type BlockDeveloperCredentialEncrypted = {|
    id?: string, // optional for new developer credentials.
    name: string,
    revision: number,
    deleted?: true,
    kmsDataKeyId: string,
    developmentCredentialValueEncrypted: string | null,
    releaseCredentialValueEncrypted: string | null,
|};

export type CredentialEncrypted = {|
    name: string,
    kmsDataKeyId: string,
    credentialValueEncrypted: string,
|};

export type CredentialPlaintext = {|
    name: string,
    credentialValuePlaintext: string,
|};
