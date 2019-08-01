// @flow
// flow-disable-next-line since the developerCredentials file will be written as part of the build process.
const developerCredentials = require('./developerCredentials.json');

const _IV_NUM_BYTES = 16;
const _MAC_NUM_BYTES = 32;
const _ENCRYPTION_KEY_NUM_BYTES = 32;
const _MAC_KEY_NUM_BYTES = 32;

function getDeveloperCredentialByName(): {[string]: string} {
    if (!developerCredentials) {
        return {};
    }
    const {developerCredentialsEncrypted} = developerCredentials;
    if (!developerCredentialsEncrypted) {
        return {};
    }

    const developerCredentialsDecrypted = _decryptCredentials(developerCredentialsEncrypted);
    const developerCredentialNamesAndValues: Array<[string, string]> = JSON.parse(
        developerCredentialsDecrypted,
    );

    const developerCredentialByName = {};
    for (const [credentialName, decryptedCredentialValue] of developerCredentialNamesAndValues) {
        developerCredentialByName[credentialName] = decryptedCredentialValue;
    }

    return developerCredentialByName;
}

/**
 * This implementation is effectively a copy of `Cryptopacker.decrypt`. It is
 * compatible with Cryptopacker's encrypt-then-MAC AE encryption technique,
 * meaning it can be used to decrypt data that has been encrypted
 * with `Cryptopacker.encrypt`. One difference is that it doesn't make use of
 * an associated data (AD) because we don't use an AD when encrypting credentials
 * for block build and deploy.
 *
 * Ideally, we'd use Cryptopacker directly, but there is currently no good/canonical
 * way of sharing dependencies/modules/code between hyperbase and backend blocks.
 *
 * @see server_shared/crypto/cryptopacker.js in hyperbase repo
 */
function _decryptCredentials(envelope: string): string {
    const key = _getBlockDeveloperCredentialsKeyIfExists();
    if (key === null) {
        throw new Error('Block Developer Credentials Key is missing');
    }

    const crypto = require('crypto');

    // TODO(richsinn): We should probably use base64_strict.js to decode. But
    //  for the same reason we can't use Cryptopacker due to lack of dependency
    //  management, we're skipping base64_strict here.
    const envelopeBuffer = Buffer.from(envelope, 'base64');
    const keyBuffer = Buffer.from(key, 'base64');
    const keyForEncryption = keyBuffer.slice(0, _ENCRYPTION_KEY_NUM_BYTES);
    const macKey = keyBuffer.slice(_MAC_KEY_NUM_BYTES);

    const {iv, cipherText, mac} = _splitEnvelope(envelopeBuffer);

    // Must check the MAC *before* even attempting decryption (see: padding oracle attack).
    const hasher = crypto.createHmac('sha512', macKey);
    hasher.update(iv);
    hasher.update(cipherText);
    // Adding 4 bytes of zeros at the end to match the MAC format from Cryptopacker. It's
    // filled with zeros because we're not using an AD here.
    hasher.update(Buffer.alloc(4, 0));
    const expectedMac512 = hasher.digest();
    const expectedMac = expectedMac512.slice(0, _MAC_NUM_BYTES);
    if (!crypto.timingSafeEqual(mac, expectedMac)) {
        throw new Error('Failed to get Block Developer Credentials Data');
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyForEncryption, iv);
    const plaintext1 = decipher.update(cipherText);
    const plaintext2 = decipher.final();

    const decryptedBuffer = Buffer.concat([plaintext1, plaintext2]);
    return decryptedBuffer.toString('utf8');
}

function _getBlockDeveloperCredentialsKeyIfExists(): string | null {
    if (!process.env.BLOCK_DEVELOPER_CREDENTIALS_KEY) {
        return null;
    }

    return process.env.BLOCK_DEVELOPER_CREDENTIALS_KEY;
}

function _splitEnvelope(envelope: Buffer): {|iv: Buffer, cipherText: Buffer, mac: Buffer|} {
    const cipherTextStart = _IV_NUM_BYTES;
    const macStart = envelope.length - _MAC_NUM_BYTES;

    const iv = envelope.slice(0, cipherTextStart);
    const cipherText = envelope.slice(cipherTextStart, macStart);
    const mac = envelope.slice(macStart);

    return {iv, cipherText, mac};
}

module.exports = getDeveloperCredentialByName;
