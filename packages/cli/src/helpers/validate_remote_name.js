// @flow
import type {ValidationResult} from '../types/validation_result';

const VALID_REMOTE_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

const INVALID_REMOTE_NAME_ERROR_MESSAGE =
    'Incorrect characters for the remote name! Only alphanumeric, -, or _ characters are allowed';

function validateRemoteName(remoteName: string): ValidationResult {
    if (!VALID_REMOTE_NAME_REGEX.test(remoteName)) {
        return {pass: false, reason: INVALID_REMOTE_NAME_ERROR_MESSAGE};
    }
    return {pass: true};
}

module.exports = validateRemoteName;
