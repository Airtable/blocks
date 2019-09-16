// @flow

/** Name of execution status header in HTTP response. */
const BLOCKS_BACKEND_EXECUTION_STATUS_HEADER = 'X-Airtable-Blocks-Backend-Execution-Status';

/** Execution statuses. */
const BlocksBackendExecutionStatuses = Object.freeze({
    // Execution completed successfully.
    SUCCESS: ('success': 'success'),
    // Request path did not match any configured handlers.
    NO_MATCHING_ROUTES: ('no-matching-routes': 'no-matching-routes'),
    // Request path matched a configured handler, but the handler could not be loaded.
    HANDLER_LOAD_ERROR: ('handler-load-error', 'handler-load-error'),
    // An exception was thrown by user-submitted block code.
    HANDLER_EXECUTION_ERROR: ('handler-execution-error': 'handler-execution-error'),
    // Could not initialize backend SDK. If this happens at runtime, it would
    // indicate a programming error.
    BACKEND_SDK_INIT_ERROR: ('backend-sdk-init-error', 'backend-sdk-init-error'),
    // The handler returned an invalid response.
    HANDLER_RESPONSE_VALIDATION_ERROR: ('handler-response-validation-error': 'handler-response-validation-error'),
});

/** Execution status. */
export type BlocksBackendExecutionStatus = $Values<typeof BlocksBackendExecutionStatuses>;

/** Constructs a headers object for the given execution status. */
function createBlocksBackendExecutionStatusHeaders(status: BlocksBackendExecutionStatus) {
    return {[BLOCKS_BACKEND_EXECUTION_STATUS_HEADER]: [status]};
}

/** Extracts execution status from a headers object. */
function getBlocksBackendExecutionStatus(
    headers:
        | {[string]: string | $ReadOnlyArray<string>}
        | {[string]: $ReadOnlyArray<string>}
        | void,
): BlocksBackendExecutionStatus | null {
    if (!headers) {
        return null;
    }
    const headerValue = Object.entries(headers)
        .filter(
            ([k, v]) => k.toLowerCase() === BLOCKS_BACKEND_EXECUTION_STATUS_HEADER.toLowerCase(),
        )
        .map(([k, v]) => v)
        .pop();
    const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (!value || !Object.values(BlocksBackendExecutionStatuses).includes(value)) {
        return null;
    }
    return ((value: any): BlocksBackendExecutionStatus); // eslint-disable-line flowtype/no-weak-types
}

module.exports = {
    BLOCKS_BACKEND_EXECUTION_STATUS_HEADER,
    BlocksBackendExecutionStatuses,
    createBlocksBackendExecutionStatusHeaders,
    getBlocksBackendExecutionStatus,
};
