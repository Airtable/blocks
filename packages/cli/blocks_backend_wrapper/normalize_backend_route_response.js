// @flow
const joi = require('@hapi/joi');
const {
    BLOCKS_BACKEND_EXECUTION_STATUS_HEADER,
    createBlocksBackendExecutionStatusHeaders,
} = require('./blocks_backend_execution_status');

import type {BackendRouteResponse} from './types/backend_route_types';
import type {BlocksBackendExecutionStatus} from './blocks_backend_execution_status';

const BANNED_HEADERS_SET = new Set([
    'connection',
    'content-encoding',
    'content-length',
    'date',
    'keep-alive',
    'proxy-authenticate',
    'server',
    'trailer',
    'transfer-encoding',
    'upgrade',
    'via',
    BLOCKS_BACKEND_EXECUTION_STATUS_HEADER,
]);

const BACKEND_ROUTE_RESPONSE_SCHEMA = joi.object().keys({
    statusCode: joi
        .number()
        .integer()
        .min(100)
        .less(600)
        .default(200)
        .optional(),
    headers: joi
        .object()
        .unknown(true)
        // Keys must not match the banned headers.
        .pattern(
            joi
                .string()
                .insensitive()
                .valid(...BANNED_HEADERS_SET),
            joi.any().forbidden(),
        )
        // All values should be non-empty arrays of strings.
        .pattern(
            joi.any(),
            joi
                .array()
                // Convert string to array with single item.
                .single(true)
                .items(joi.string().allow(''))
                .min(1),
        )
        .default({})
        .optional(),
    body: joi
        .alternatives()
        .try(joi.string().allow(''), joi.binary(), joi.object(), joi.array())
        .default(Buffer.alloc(0))
        .optional(),
    errorData: joi
        .object()
        .keys({
            stack: joi
                .string()
                .allow('')
                .required(),
            message: joi
                .string()
                .allow('')
                .required(),
            name: joi
                .string()
                .allow('')
                .required(),
        })
        .optional(),
});

function convertHeadersArrayToObjectIfNecessary(
    headersArray: $ReadOnlyArray<mixed>,
): {[string]: $ReadOnlyArray<mixed>} {
    if (headersArray.length % 2) {
        throw new Error(`Headers array has unexpected length ${headersArray.length}`);
    }
    const headers = {};
    for (let i = 0; i < headersArray.length; i += 2) {
        const headerName = headersArray[i];
        const headerValue = headersArray[i + 1];
        if (typeof headerName !== 'string') {
            throw new Error(
                `Header name at index ${i} has incorrect type ${typeof headerName}, expected string`,
            );
        }

        if (headers.hasOwnProperty(headerName)) {
            headers[headerName].push(headerValue);
        } else {
            headers[headerName] = [headerValue];
        }
    }
    return headers;
}

/** Normalize response from backend route handlers.
 *
 * - The statusCode, headers and body fields will be set to the defaults (200,
 *   {}, empty Buffer)if not specified.
 * - Headers are normalized to the format {[string]: Array<string>}.
 * - The BLOCKS_BACKEND_EXECUTION_STATUS_HEADER will be set to the specified status.
 */
function normalizeBackendRouteResponse(
    response: BackendRouteResponse,
    status: BlocksBackendExecutionStatus,
): BackendRouteResponse {
    if (Array.isArray(response.headers)) {
        // eslint-disable-next-line flowtype/no-weak-types
        response.headers = (convertHeadersArrayToObjectIfNecessary(response.headers): any);
    }
    const {error, value: validatedResponse} = BACKEND_ROUTE_RESPONSE_SCHEMA.validate(response);
    if (error) {
        const validationErrorMessage = error.annotate(true /* disable color */);
        throw new Error(`Invalid response\n${validationErrorMessage}`);
    }

    // TODO(Chuan): Base64-encode response body.

    Object.assign(validatedResponse.headers, createBlocksBackendExecutionStatusHeaders(status));
    return validatedResponse;
}

module.exports = normalizeBackendRouteResponse;
