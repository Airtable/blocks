// @flow

import type {$Request, $Response, Middleware, NextFunction} from 'express';

export type RequestId = number;

export type RequestWithRequestId = $Request & {
    requestId: RequestId,
};

/** Set a requestId on each request. */
function setRequestIdMiddleware(): Middleware {
    let nextRequestId: RequestId = 0;
    return (req: $Request, res: $Response, next: NextFunction) => {
        // Flow typecasting the `req` const to be `RequestWithRequestId`
        // because all request objects after this middleware should
        // have the "requestId" attribute defined to `req`.
        ((req: any): RequestWithRequestId).requestId = nextRequestId; // eslint-disable-line flowtype/no-weak-types
        nextRequestId++;
        next();
    };
}

module.exports = setRequestIdMiddleware;
