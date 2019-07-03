"use strict";var BANNED_HEADERS_SET = new Set([
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
'via']);


function normalizeUserResponse(userResponse) {
  var statusCode = userResponse.hasOwnProperty('statusCode') ? userResponse.statusCode : 200;
  var isStatusCodeValid =
  statusCode === Math.floor(statusCode) &&
  statusCode >= 100 &&
  statusCode < 600;

  if (!isStatusCodeValid) {
    return _failure('statusCode is not one of the allowed status codes');
  }

  var userHeaders = userResponse.hasOwnProperty('headers') ? userResponse.headers : [];
  var headers;
  if (Array.isArray(userHeaders)) {
    headers = {};
    for (var i = 0; i < userHeaders.length; i += 2) {
      var headerName = userHeaders[i];
      var headerValue = userHeaders[i + 1];

      if (typeof headerName !== 'string' || typeof headerValue !== 'string') {
        return _failure('headers must be an array of strings');
      } else if (BANNED_HEADERS_SET.has(headerName.toLowerCase())) {
        return _failure("header name \"".concat(headerName, "\" is not allowed"));
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

  var body;
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
    statusCode: statusCode,
    headers: headers,
    body: body };

}

function _failure(message) {
  return {
    statusCode: 500,
    headers: {
      'Content-Type': ['application/json; charset=utf-8'] },

    body: Buffer.from(JSON.stringify({
      error: 'SERVER_ERROR',
      message: message })) };


}

module.exports = normalizeUserResponse;