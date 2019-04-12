// @flow
const invariant = require('invariant');
const getBlockDirPath = require('../get_block_dir_path');
const getDeveloperCredentialsEncryptedIfExistsAsync = require('../get_developer_credentials_encrypted_if_exists_async');
const writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');

import type {Argv} from 'yargs';

async function updateBlockDeveloperCredentialNameAsync(
    currentName: string,
    newName: string,
): Promise<void> {
    const blockDirPath = getBlockDirPath();
    const developerCredentialsEncrypted = await getDeveloperCredentialsEncryptedIfExistsAsync();

    if (developerCredentialsEncrypted === null) {
        console.log(_getNotFoundMessage(currentName));
        return;
    }

    const existingCredentialIndex = developerCredentialsEncrypted.findIndex(developerCredentialEncrypted => {
        return developerCredentialEncrypted.name === currentName;
    });
    if (existingCredentialIndex < 0) {
        console.log(_getNotFoundMessage(currentName));
        return;
    }

    if (currentName === newName) {
        console.log('No changes were made! The new name is the same as the current name.');
        return;
    }

    const existingCredentialThatAlreadyHasNewNameIndex = developerCredentialsEncrypted.findIndex(developerCredentialEncrypted => {
        return developerCredentialEncrypted.name === newName;
    });
    if (existingCredentialThatAlreadyHasNewNameIndex >= 0) {
        console.log(`Duplicate name! Developer credential with '${newName}' already exists!`);
        return;
    }

    // Mutate values and then write back to the file system
    developerCredentialsEncrypted[existingCredentialIndex].name = newName;
    await writeDeveloperCredentialsFromApiResponseAsync(
        developerCredentialsEncrypted,
        blockDirPath,
    );
    console.log(`Successfully renamed to ${newName}.`);
}

const _getNotFoundMessage = name => `Developer credential with '${name}' not found!`;

async function runCommandAsync(argv: Argv): Promise<void> {
    const {currentName, newName} = argv;
    invariant(typeof currentName === 'string', 'currentName must be string');
    invariant(typeof newName === 'string', 'newName must be string');

    const currentNameTrimmed = currentName.trim();
    const newNameTrimmed = newName.trim();
    await updateBlockDeveloperCredentialNameAsync(currentNameTrimmed, newNameTrimmed);
}

module.exports = {runCommandAsync};
