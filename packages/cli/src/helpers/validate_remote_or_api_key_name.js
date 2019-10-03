// @flow
import type {ValidationResult} from '../types/validation_result';

const VALID_REMOTE_OR_API_KEY_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

const INVALID_REMOTE_OR_API_KEY_NAME_ERROR_MESSAGE =
    'Incorrect characters for the name! Only alphanumeric, -, or _ characters are allowed';

function validateRemoteOrApiKeyName(name: string): ValidationResult {
    if (!VALID_REMOTE_OR_API_KEY_NAME_REGEX.test(name)) {
        return {pass: false, reason: INVALID_REMOTE_OR_API_KEY_NAME_ERROR_MESSAGE};
    }
    return {pass: true};
}

module.exports = validateRemoteOrApiKeyName;
