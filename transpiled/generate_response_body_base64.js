"use strict";

var RESPONSE_NOT_FOUND = 'NOT_FOUND';





function generateResponseBodyBase64(body) {
  return {
    body: Buffer.from(JSON.stringify(body)).toString('base64'),
    bodyFormat: 'base64' };

}

module.exports = generateResponseBodyBase64;