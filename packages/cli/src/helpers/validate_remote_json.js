// @flow
import type {ValidationResult} from '../types/validation_result';

const INVALID_REMOTE_JSON_ERROR_MESSAGE = `remote.json must be an object with the following properties:

- blockId: string
- baseId: string`;

function validateRemoteJson(remoteJson: mixed): ValidationResult {
    if (
        remoteJson instanceof Object &&
        typeof remoteJson.blockId === 'string' &&
        typeof remoteJson.baseId === 'string' &&
        (remoteJson.server === undefined || typeof remoteJson.server === 'string') &&
        (remoteJson.apiKeyName === undefined || typeof remoteJson.apiKeyName === 'string') &&
        (remoteJson.bundleCdn === undefined || typeof remoteJson.bundleCdn === 'string') &&
        (remoteJson.remoteName === undefined || typeof remoteJson.remoteName === 'string')
    ) {
        return {pass: true};
    }
    return {pass: false, reason: INVALID_REMOTE_JSON_ERROR_MESSAGE};
}

module.exports = validateRemoteJson;
