const LEGAL_STATUS_CODES_SET = new Set([
    200,
    201,
    202,
    204,
    302,
    400,
    401,
    403,
    404,
    500,
    502,
    503,
    504,
]);
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

function normalizeUserResponse(userResponse) {
    const statusCode = userResponse.hasOwnProperty('statusCode') ? userResponse.statusCode : 200;
    if (!LEGAL_STATUS_CODES_SET.has(statusCode)) {
        return _failure('statusCode is not one of the allowed status codes');
    }

    const userHeaders = userResponse.hasOwnProperty('headers') ? userResponse.headers : [];
    let headers;
    if (Array.isArray(userHeaders)) {
        headers = {};
        for (let i = 0; i < userHeaders.length; i += 2) {
            const headerName = userHeaders[i];
            const headerValue = userHeaders[i + 1];

            if ((typeof headerName !== 'string') || (typeof headerValue !== 'string')) {
                return _failure('headers must be an array of strings');
            } else if (BANNED_HEADERS_SET.has(headerName.toLowerCase())) {
                return _failure(`header name "${headerName}" is not allowed`);
            }

            if (headers.hasOwnProperty(headerName)) {
                headers[headerName].push(headerValue);
            } else {
                headers[headerName] = [headerValue];
            }
        }
    } else {
        return _failure('headers must be an array');
    }

    let body;
    if (userResponse.hasOwnProperty('body')) {
        if (userResponse.bodyFormat !== 'base64') {
            return _failure('body must be base64-encoded and have bodyFormat: "base64" set');
        } else if (typeof userResponse.body !== 'string') {
            return _failure('body must be a base64-encoded string');
        } else {
            body = Buffer.from(userResponse.body, 'base64');
            if (body.toString('base64') !== userResponse.body) {
                return _failure("body isn't properly base64-encoded");
            }
        }
    } else {
        body = Buffer.alloc(0);
    }

    return {
        statusCode,
        headers,
        body,
    };
}

function _failure(message) {
    return {
        statusCode: 500,
        headers: {
            'Content-Type': ['application/json; charset=utf-8']
        },
        body: Buffer.from(JSON.stringify({
            error: 'SERVER_ERROR',
            message,
        })),
    };
}

module.exports = normalizeUserResponse;
