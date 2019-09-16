// @flow
const joi = require('@hapi/joi');
const {createBlocksBackendExecutionStatusHeaders} = require('./blocks_backend_execution_status');

import type {
    BackendRouteResponse,
    NormalizedBackendRouteResponse,
} from './types/backend_route_types';
import type {BlocksBackendExecutionStatus} from './blocks_backend_execution_status';

// AWS Lambda response size limit is 6MB. Choosing a slightly smaller limit here
// to make room for headers, JSON overhead, etc.
const BASE64_ENCODED_RESPONSE_BODY_SIZE_LIMIT_BYTES = 5 * 1024 * 1024;

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
]);

const DEFAULT_CONTENT_TYPES = Object.freeze({
    STRING: ('text/html; charset=utf-8': 'text/html; charset=utf-8'),
    JSON: ('application/json; charset=utf8': 'application/json; charset=utf8'),
    BINARY: ('application/octet-stream': 'application/octet-stream'),
});
type DefaultContentTypeValue = $Values<typeof DEFAULT_CONTENT_TYPES>;

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
        .any()
        .when('bodyFormat', {
            is: 'base64',
            then: joi
                .string()
                .base64()
                .allow(''),
            otherwise: joi
                .alternatives()
                .try(joi.string().allow(''), joi.binary(), joi.object(), joi.array()),
        })
        .default('')
        .optional(),
    bodyFormat: joi
        .string()
        .valid('base64')
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
    headersArray: $ReadOnlyArray<string>,
): {[string]: $ReadOnlyArray<string>} {
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

function normalizeBufferBody(bufferBody: Buffer): string {
    return bufferBody.toString('base64');
}

function normalizeStringBody(stringBody: string): string {
    return normalizeBufferBody(Buffer.from(stringBody, 'utf-8'));
}

function normalizeJSONBody(jsonBody: Object | Array<mixed>): string {
    return normalizeStringBody(JSON.stringify(jsonBody));
}

function normalizeBody(
    body: string | Buffer | Object | Array<mixed>,
): {
    normalizedBody: string,
    defaultContentType: DefaultContentTypeValue,
} {
    let normalizedBody: string;
    let defaultContentType: DefaultContentTypeValue;
    switch (body.constructor) {
        case Object:
        case Array:
            normalizedBody = normalizeJSONBody((body: any)); // eslint-disable-line flowtype/no-weak-types
            defaultContentType = DEFAULT_CONTENT_TYPES.JSON;
            break;
        case String:
            normalizedBody = normalizeStringBody((body: any)); // eslint-disable-line flowtype/no-weak-types
            defaultContentType = DEFAULT_CONTENT_TYPES.STRING;
            break;
        case Buffer:
            normalizedBody = normalizeBufferBody((body: any)); // eslint-disable-line flowtype/no-weak-types
            defaultContentType = DEFAULT_CONTENT_TYPES.BINARY;
            break;
        default:
            // This should not be possible since Joi should have caught this already.
            throw new Error(`Unexpected response body type: ${typeof body}`);
    }
    return {normalizedBody, defaultContentType};
}

function addContentTypeHeaderIfNotExists(
    headers: {[string]: $ReadOnlyArray<string>},
    contentType: string,
) {
    if (!Object.keys(headers).some(headerName => headerName.toLowerCase() === 'content-type')) {
        headers['Content-Type'] = [contentType];
    }
    return headers;
}

/** Normalize response from backend route handlers.
 *
 * - The statusCode, headers and body fields will be set to the defaults (200,
 *   {}, empty string)if not specified.
 *
 * - Headers are normalized to the format {[string]: Array<string>}.
 *
 * - The body is normalized:
 *
 *     * Strings will be converted to UTF-8, then base64-encoded; will add
 *       Content-Type header with DEFAULT_CONTENT_TYPES.STRING if not provided.
 *
 *     * Buffers are base64-encoded; will add Content-Type header with
 *       DEFAULT_CONTENT_TYPES.BINARY if not provided.
 *
 *     * Objects and arrays are JSON-stringified, then converted to UTF-8, then
 *       base64-encoded; will add Content-Type header with
 *       DEFAULT_CONTENT_TYPES.JSON if not provided.
 *
 *     * If the "bodyFormat" field is set to 'base64', body must be valid
 *       base64-encoded string and will not be transformed; no Content-Type
 *       header will be added.
 *
 * - The BLOCKS_BACKEND_EXECUTION_STATUS_HEADER will be set to the specified
 *   status.
 */
function normalizeBackendRouteResponse(
    response: BackendRouteResponse,
    status?: BlocksBackendExecutionStatus,
): NormalizedBackendRouteResponse {
    if (Array.isArray(response.headers)) {
        response.headers = convertHeadersArrayToObjectIfNecessary(response.headers);
    }
    const {error, value: validatedResponse} = BACKEND_ROUTE_RESPONSE_SCHEMA.validate(response);
    if (error) {
        const validationErrorMessage = error.annotate(true /* disable color */);
        throw new Error(`Invalid response\n${validationErrorMessage}`);
    }

    if (validatedResponse.bodyFormat !== 'base64') {
        const {normalizedBody, defaultContentType} = normalizeBody(validatedResponse.body);
        validatedResponse.body = normalizedBody;
        validatedResponse.bodyFormat = 'base64';
        addContentTypeHeaderIfNotExists(validatedResponse.headers, defaultContentType);
    }
    // The most "correct" way to check for the AWS Lambda response size limit
    // would be to check the serialized size of the entire response object.
    // However, doing so would require an otherwise unnecessary serialization
    // step, which may be quite expensive if the response is large. Since large
    // headers are likely rare, we're heuristically only checking the response
    // body size here.
    if (validatedResponse.body.length > BASE64_ENCODED_RESPONSE_BODY_SIZE_LIMIT_BYTES) {
        throw new Error('Response body too large');
    }

    if (status) {
        Object.assign(validatedResponse.headers, createBlocksBackendExecutionStatusHeaders(status));
    }
    return validatedResponse;
}

module.exports = {
    normalizeBackendRouteResponse,
    BASE64_ENCODED_RESPONSE_BODY_SIZE_LIMIT_BYTES,
    DEFAULT_CONTENT_TYPES,
};
