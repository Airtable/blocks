// @flow
const parseBlockJsonAsync = require('./parse_block_json_async');
const validateBlockJson = require('./validate_block_json');

import type {Result} from '../types/result';
import type {BlockJson} from '../types/block_json_type';

async function parseAndValidateBlockJsonAsync(): Promise<Result<BlockJson>> {
    const parseResult = await parseBlockJsonAsync();
    if (parseResult.err) {
        return parseResult;
    }
    const blockJson = parseResult.value;
    const validationResult = validateBlockJson(blockJson);
    if (!validationResult.pass) {
        return {err: new Error(validationResult.reason)};
    }
    return {
        value: ((blockJson: any): BlockJson), // eslint-disable-line flowtype/no-weak-types
    };
}

module.exports = parseAndValidateBlockJsonAsync;
