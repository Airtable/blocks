// @flow
/* eslint-disable no-console */
const getBlockDirPath = require('../get_block_dir_path');
const getDeveloperCredentialsEncryptedIfExistsAsync = require('../get_developer_credentials_encrypted_if_exists_async');
const writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');

import type {Argv} from 'yargs';

const CREDENTIAL_NOT_FOUND_MSG = 'Credential not found!';
/**
 * This only modifies the developer credentials locally. 'block push' must be used
 * to synchronize changes with the server.
 */
async function deleteDeveloperCredentialAsync(nameOfCredentialToDelete: string): Promise<void> {
    const developerCredentialsEncrypted = await getDeveloperCredentialsEncryptedIfExistsAsync();

    if (developerCredentialsEncrypted === null) {
        console.log(CREDENTIAL_NOT_FOUND_MSG);
        return;
    }

    const indexOfDeveloperCredentialToDelete = developerCredentialsEncrypted.findIndex(developerCredentialEncrypted => {
        return developerCredentialEncrypted.name === nameOfCredentialToDelete;
    });
    if (indexOfDeveloperCredentialToDelete < 0) {
        console.log(CREDENTIAL_NOT_FOUND_MSG);
        return;
    }

    const developerCredentialEncryptedToDelete = developerCredentialsEncrypted[indexOfDeveloperCredentialToDelete];

    // Mutate developerCredentialEncrypted with deletions:
    //   1. Mark object as deleted if `id` value exists. The server will handle the deletion
    //      on next `block push`.
    //   2. Remove object from the array if `id` value does not exist because the object
    //      doesn't exist on server yet.
    if (developerCredentialEncryptedToDelete.id) {
        // If id exists, we mark it as deleted and re-write to the local file system.
        // The next time 'block push' is executed, the server will delete the marked credential.
        developerCredentialEncryptedToDelete.deleted = true;
    } else {
        // If id doesn't exist, then it means the credential is not on the server yet.
        // We can just remove it from the array and re-write to the file system
        developerCredentialsEncrypted.splice(indexOfDeveloperCredentialToDelete, 1);
    }

    const blockDirPath = getBlockDirPath();
    await writeDeveloperCredentialsFromApiResponseAsync(
        developerCredentialsEncrypted,
        blockDirPath,
    );
}

async function runCommandAsync(argv: Argv): Promise<void> {
    const {credentialName} = argv;
    const nameOfCredentialToDelete = ((credentialName: any): string); // eslint-disable-line flowtype/no-weak-types
    await deleteDeveloperCredentialAsync(nameOfCredentialToDelete);
    console.log(`Deleted '${nameOfCredentialToDelete}' credential.`);
}

module.exports = {runCommandAsync};
