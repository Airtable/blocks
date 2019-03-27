// @flow
const fs = require('fs');
const path = require('path');
const invariant = require('invariant');
const BlockBuildTypes = require('../types/block_build_types');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const cliHelpers = require('../helpers/cli_helpers');
const APIClient = require('../api_client');
const getApiKeySync = require('../get_api_key_sync');
const getBlockDirPath = require('../get_block_dir_path');
const getDeveloperCredentialsEncryptedIfExistsAsync = require('../get_developer_credentials_encrypted_if_exists_async');
const writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');

import type {Argv} from 'yargs';
import type {BlockBuildType} from '../types/block_build_types';
import type {BlockFile} from '../types/block_file_type';
import type {
    BlockDeveloperCredentialEncrypted,
    CredentialEncrypted,
} from '../types/block_developer_credential_types';

type KmsDataKeyId = string;
type Base64 = string;

type SetCredentialPromptResult = {|
    developmentOrReleaseType: BlockBuildType,
    name: string,
    credentialValue: string,
|};

/**
 * This only "upserts" developer credentials to the local filesystem. Specifically, it
 * mutates the blocksConfigSettings.DEVELOPER_CREDENTIALS_FILE_NAME file. It does NOT
 * synchronize credential values with the server.
 *
 * The developer will have to execute the `block push` command to synchronize
 * changes with the server.
 */
async function blockSetDeveloperCredentialAsync(promptInput: SetCredentialPromptResult): Promise<void> {
    const blockDirPath = getBlockDirPath();
    const blockFileDataJson = fs.readFileSync(
        path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
        'utf8'
    );
    const blockFileData = JSON.parse(blockFileDataJson);
    const apiClient = _getApiClient(blockFileData, blockDirPath);
    const developerCredentialsEncrypted = await getDeveloperCredentialsEncryptedIfExistsAsync();

    if (developerCredentialsEncrypted === null) {
        // Create a new file from scratch because either .developerCredential.json file
        // doesn't exist or the developerCredentialsEncrypted value is null.
        return await _createNewDeveloperCredentialFileAsync(apiClient, blockDirPath, promptInput);
    }

    return await _upsertCredentialAsync(apiClient, blockDirPath, developerCredentialsEncrypted, promptInput);
}

async function _createNewDeveloperCredentialFileAsync(
    apiClient: APIClient,
    blockDirPath: string,
    promptInput: SetCredentialPromptResult,
): Promise<void> {
    const {
        developmentOrReleaseType,
        name,
        credentialValue,
    } = promptInput;
    const credentialEncrypted = await apiClient.encryptCredentialAsync(
        {
            name,
            credentialValuePlaintext: credentialValue
        },
    );
    const developerCredentialEncrypted = _createNewDeveloperCredentialEncrypted(credentialEncrypted, developmentOrReleaseType);
    return await writeDeveloperCredentialsFromApiResponseAsync(
        [developerCredentialEncrypted],
        blockDirPath,
    );
}

async function _upsertCredentialAsync(
    apiClient: APIClient,
    blockDirPath: string,
    developerCredentialsEncrypted: Array<BlockDeveloperCredentialEncrypted>,
    promptInput: SetCredentialPromptResult,
): Promise<void> {
    const {
        developmentOrReleaseType,
        name,
        credentialValue,
    } = promptInput;

    const existingCredentialIndex = developerCredentialsEncrypted.findIndex(developerCredentialEncrypted => {
        return developerCredentialEncrypted.name === name;
    });
    const existingDeveloperCredentialEncrypted = _getExistingDeveloperCredentialEncryptedIfExists(existingCredentialIndex, developerCredentialsEncrypted);

    let kmsDataKeyId;
    if (existingDeveloperCredentialEncrypted) {
        // kmsDataKeyId can be undefined in the create case because
        // existingDeveloperCredentialEncrypted will be null.
        kmsDataKeyId = existingDeveloperCredentialEncrypted.kmsDataKeyId;
    }

    const credentialEncrypted = await apiClient.encryptCredentialAsync(
        {
            name,
            credentialValuePlaintext: credentialValue,
        },
        kmsDataKeyId,
    );

    if (existingDeveloperCredentialEncrypted === null) {
        // 1. Create (i.e. "Insert") case.
        const newDeveloperCredentialEncrypted = _createNewDeveloperCredentialEncrypted(credentialEncrypted, developmentOrReleaseType);

        developerCredentialsEncrypted.push(newDeveloperCredentialEncrypted);
    } else {
        // 2. Update case.
        const updatedDeveloperCredentialEncrypted = await _getUpdatedDeveloperCredentialEncryptedAsync(
            apiClient,
            existingDeveloperCredentialEncrypted,
            credentialEncrypted,
            developmentOrReleaseType,
        );

        developerCredentialsEncrypted.splice(existingCredentialIndex, 1, updatedDeveloperCredentialEncrypted);
    }

    return await writeDeveloperCredentialsFromApiResponseAsync(
        developerCredentialsEncrypted,
        blockDirPath,
    );
}

function _getExistingDeveloperCredentialEncryptedIfExists(
    existingCredentialIndex: number,
    developerCredentialsEncrypted: Array<BlockDeveloperCredentialEncrypted>,
): BlockDeveloperCredentialEncrypted | null {
    let existingDeveloperCredentialEncrypted;
    if (existingCredentialIndex === -1 && developerCredentialsEncrypted.length === blocksConfigSettings.MAX_NUM_CREDENTIALS_PER_BLOCK) {
        // If existingCredentialIndex is not found, it means we are creating a new credential
        // and we should check to see if creating will exceed the limit.
        console.log('Cannot create credential because it would exceed the maximum number of credentials per block');
        throw new Error('Exceeded MAX_NUM_CREDENTIALS_PER_BLOCK');
    } else if (existingCredentialIndex === -1) {
        existingDeveloperCredentialEncrypted = null;
    } else if (existingCredentialIndex >= 0) {
        existingDeveloperCredentialEncrypted = developerCredentialsEncrypted[existingCredentialIndex];
    } else {
        throw new Error(`Invalid index ${existingCredentialIndex} for developerCredentialsEncrypted`);
    }

    return existingDeveloperCredentialEncrypted;
}

/**
 * Creates a new developer credential object to insert in the file system.
 * Currently, only one credential type can be set at a time via the CLI command.
 * This means the other credential type will default to null.
 */
function _createNewDeveloperCredentialEncrypted(
    credentialEncrypted: CredentialEncrypted,
    blockBuildType: BlockBuildType,
): BlockDeveloperCredentialEncrypted {
    // flow-disable-next-line exact-type bug
    const developerCredentialEncrypted: BlockDeveloperCredentialEncrypted = {};
    developerCredentialEncrypted.name = credentialEncrypted.name;
    developerCredentialEncrypted.revision = 0;
    developerCredentialEncrypted.kmsDataKeyId = credentialEncrypted.kmsDataKeyId;

    switch (blockBuildType) {
        case BlockBuildTypes.DEVELOPMENT:
            developerCredentialEncrypted.developmentCredentialValueEncrypted = credentialEncrypted.credentialValueEncrypted;
            developerCredentialEncrypted.releaseCredentialValueEncrypted = null;
            break;

        case BlockBuildTypes.RELEASE:
            developerCredentialEncrypted.developmentCredentialValueEncrypted = null;
            developerCredentialEncrypted.releaseCredentialValueEncrypted = credentialEncrypted.credentialValueEncrypted;
            break;

        default:
            throw new Error(`Unrecognized blockBuildType: ${blockBuildType}`);
    }

    return developerCredentialEncrypted;
}

/**
 * Updates an existing developer credential object. Currently, only one credential type
 * can be updated at a time via the CLI command. This means the other credential type
 * will "inherit" from the parent.
 *
 * NOTE: There is a special case when "inheriting" the credential value: if the
 * kmsDataKey is no longer "active" for the credential object, we re-encrypt
 * the "inherited" value before saving to the file system.
 */
async function _getUpdatedDeveloperCredentialEncryptedAsync(
    apiClient: APIClient,
    parentDeveloperCredentialEncrypted: BlockDeveloperCredentialEncrypted,
    newCredentialEncrypted: CredentialEncrypted,
    blockBuildType: BlockBuildType,
): Promise<BlockDeveloperCredentialEncrypted> {
    if (parentDeveloperCredentialEncrypted.name !== newCredentialEncrypted.name) {
        // NOTE: We are only updating credential values here, so the names should be equal.
        throw new Error('Names do not match up after encrypt');
    }

    // flow-disable-next-line exact-type bug
    const updatedDeveloperCredentialEncrypted: BlockDeveloperCredentialEncrypted = {};
    updatedDeveloperCredentialEncrypted.id = parentDeveloperCredentialEncrypted.id;
    updatedDeveloperCredentialEncrypted.name = newCredentialEncrypted.name;
    updatedDeveloperCredentialEncrypted.revision = parentDeveloperCredentialEncrypted.revision;
    updatedDeveloperCredentialEncrypted.kmsDataKeyId = newCredentialEncrypted.kmsDataKeyId;


    switch (blockBuildType) {
        case BlockBuildTypes.DEVELOPMENT:
            updatedDeveloperCredentialEncrypted.developmentCredentialValueEncrypted = newCredentialEncrypted.credentialValueEncrypted;

            updatedDeveloperCredentialEncrypted.releaseCredentialValueEncrypted = await _inheritOrReEncryptCredentialValueEncryptedAsync(
                apiClient,
                {
                    name: parentDeveloperCredentialEncrypted.name,
                    kmsDataKeyId: parentDeveloperCredentialEncrypted.kmsDataKeyId,
                    credentialValueEncrypted: parentDeveloperCredentialEncrypted.releaseCredentialValueEncrypted
                },
                newCredentialEncrypted.kmsDataKeyId
            );

            break;

        case BlockBuildTypes.RELEASE:
            updatedDeveloperCredentialEncrypted.developmentCredentialValueEncrypted = await _inheritOrReEncryptCredentialValueEncryptedAsync(
                apiClient,
                {
                    name: parentDeveloperCredentialEncrypted.name,
                    kmsDataKeyId: parentDeveloperCredentialEncrypted.kmsDataKeyId,
                    credentialValueEncrypted: parentDeveloperCredentialEncrypted.developmentCredentialValueEncrypted
                },
                newCredentialEncrypted.kmsDataKeyId
            );
            updatedDeveloperCredentialEncrypted.releaseCredentialValueEncrypted = newCredentialEncrypted.credentialValueEncrypted;
            break;

        default:
            throw new Error(`Unrecognized blockBuildType: ${blockBuildType}`);
    }

    return updatedDeveloperCredentialEncrypted;
}

/**
 * Because we can only update one credential type at a time via the blocks-cli commands,
 * the other credential type will be "inherited". In most cases, we can simply copy over
 * the unchanged values.
 *
 * However, if the existing kmsDataKey is expired, then there will be a mismatch
 * with the kmsDataKey used to encrypt the updated credential value. In this case, we'll
 * need to re-encrypt the unchanged credential value with the new kmsDataKey.
 */
async function _inheritOrReEncryptCredentialValueEncryptedAsync(
    apiClient: APIClient,
    parentCredentialEncrypted: {|
        name: string,
        kmsDataKeyId: KmsDataKeyId,
        credentialValueEncrypted: Base64 | null
    |},
    newCredentialKmsDataKeyId: KmsDataKeyId,
): Promise<Base64 | null> {
    const {
        name,
        kmsDataKeyId,
        credentialValueEncrypted,
    } = parentCredentialEncrypted;

    const shouldInherit = credentialValueEncrypted === null ||
        kmsDataKeyId === newCredentialKmsDataKeyId;

    let credentialValueEncryptedToReturn;
    if (shouldInherit) {
        credentialValueEncryptedToReturn = credentialValueEncrypted;
    } else {
        invariant(credentialValueEncrypted, 'credentialValueEncrypted');
        const reEncryptedCredentialEncrypted = await apiClient.reEncryptCredentialAsync(
            {
                name,
                kmsDataKeyId,
                credentialValueEncrypted,
            },
            newCredentialKmsDataKeyId,
        );
        credentialValueEncryptedToReturn = reEncryptedCredentialEncrypted.credentialValueEncrypted;
    }
    return credentialValueEncryptedToReturn;
}

function _getApiClient(
    blockFileData: BlockFile,
    blockDirPath: string,
): APIClient {
    const apiKey = getApiKeySync(blockDirPath);
    return new APIClient({
        environment: blockFileData.environment,
        applicationId: blockFileData.applicationId,
        blockId: blockFileData.blockId,
        apiKey,
    });
}

async function runCommandAsync(argv: Argv): Promise<void> {
    const promptSchema = [
        {
            name: 'developmentOrReleaseType',
            description: 'Select [1] for development or [2] for production credential',
            type: 'integer',
            required: true,
            conform: value => {
                return value === 1 || value === 2;
            },
            message: 'Select 1 or 2',
            before: value => {
                if (value === 1) {
                    return BlockBuildTypes.DEVELOPMENT;
                } else if (value === 2) {
                    return BlockBuildTypes.RELEASE;
                } else {
                    // Returning null will be handled by the 'conform' method.
                    return null;
                }
            }
        },
        {
            name: 'name',
            description: 'Please enter a name for the credentials',
            message: 'Name must be no more than 255 characters',
            conform: value => {
                value = value.trim();
                return value.length <= blocksConfigSettings.MAX_BLOCK_DEVELOPER_CREDENTIAL_NAME_LENGTH;
            },
            before: value => {
                return value.trim();
            },
            required: true,
        },
        {
            name: 'credentialValue',
            hidden: 'true',
            replace: '*',
            description: 'Please enter the credential value',
            required: true,
        },
    ];

    const result: SetCredentialPromptResult = await cliHelpers.promptAsync(promptSchema);
    await blockSetDeveloperCredentialAsync(result);
    console.log(`Set ${result.developmentOrReleaseType} credential for '${result.name}'. Must run 'block push' to synchronize changes with Airtable.`);
}

module.exports = {runCommandAsync};
