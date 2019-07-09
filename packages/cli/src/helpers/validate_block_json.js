// @flow
const doesBlockJsonResembleOldFormat = require('./does_block_json_resemble_old_format');

import type {ValidationResult} from '../types/validation_result';

const INVALID_BLOCK_JSON_ERROR_MESSAGE = `block.json must be an object with the following properties:

- frontendEntry: string`;

const OLD_BLOCK_JSON_FORMAT_ERROR_MESSAGE =
    'It looks like you are working on a block that is not yet migrated to the new block.json format. You may need to use an old version of blocks-cli';

function validateBlockJson(blockJson: mixed): ValidationResult {
    if (!(blockJson instanceof Object)) {
        return {pass: false, reason: INVALID_BLOCK_JSON_ERROR_MESSAGE};
    }
    if (typeof blockJson.frontendEntry === 'string') {
        return {pass: true};
    }
    if (doesBlockJsonResembleOldFormat(blockJson)) {
        return {pass: false, reason: OLD_BLOCK_JSON_FORMAT_ERROR_MESSAGE};
    } else {
        return {pass: false, reason: INVALID_BLOCK_JSON_ERROR_MESSAGE};
    }
}

module.exports = validateBlockJson;
