// @flow
const USER_API_KEY_REGEX = /^key[0-ZA-Za-z]{14}$/;
const PERSONAL_ACCESS_TOKEN_REGEX = /^pat[a-zA-Z0-9]{14}\.[0-9a-f]{64}$/;

// eslint-disable-next-line airtable/is-returns-boolean
function isApiKeyValid(apiKey: string): boolean {
    return USER_API_KEY_REGEX.test(apiKey) || PERSONAL_ACCESS_TOKEN_REGEX.test(apiKey);
}

module.exports = isApiKeyValid;
