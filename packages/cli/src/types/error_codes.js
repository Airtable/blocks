// @flow

const ErrorCodes = Object.freeze({
    BUNDLE_ERROR: ('BUNDLE_ERROR': 'BUNDLE_ERROR'),
});
export type ErrorCode = $Values<typeof ErrorCodes>;

module.exports = ErrorCodes;
