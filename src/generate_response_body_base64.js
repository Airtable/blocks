// @flow

const RESPONSE_NOT_FOUND = ('NOT_FOUND': 'NOT_FOUND');

type ResponseBodyGeneric = {+[string]: mixed};
type ResponseBody = typeof RESPONSE_NOT_FOUND | ResponseBodyGeneric;
type Base64 = string;

function generateResponseBodyBase64(body: ResponseBody): {|body: Base64, bodyFormat: 'base64'|} {
    return {
        body: Buffer.from(JSON.stringify(body)).toString('base64'),
        bodyFormat: 'base64',
    };
}

module.exports = generateResponseBodyBase64;
