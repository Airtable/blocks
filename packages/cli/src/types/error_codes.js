// @flow

const ErrorCodes = Object.freeze({
    BUNDLE_ERROR: ('BUNDLE_ERROR': 'BUNDLE_ERROR'),
    BABEL_PARSE_ERROR: ('BABEL_PARSE_ERROR': 'BABEL_PARSE_ERROR'),
});
export type ErrorCode = $Values<typeof ErrorCodes>;

export type ErrorWithCode = Error & {
    code?: ErrorCode,
};

export type TranspileError = ErrorWithCode & {
    filePath: string,
};

module.exports = ErrorCodes;
