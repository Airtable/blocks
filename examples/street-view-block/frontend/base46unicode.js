// btoa only supports ascii, so have to encode unicode.
// This code is derived from similar code found in the Maps block.
// The Maps block sourced it from
// https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem

export function base64EncodeUnicode(str) {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, hc) =>
            String.fromCharCode(`0x${hc}`),
        ),
    );
}

export function base64DecodeUnicode(str) {
    return decodeURIComponent(
        atob(str)
            .split('')
            .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join(''),
    );
}
