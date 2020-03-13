// @flow
const invariant = require('invariant');

import type {BlocksDevCredentialsInterface} from './types/blocks_dev_credentials_interface';

type DeveloperCredentialsObject = {developerCredentialsEncrypted: string};

const _IV_NUM_BYTES = 16;
const _MAC_NUM_BYTES = 32;
const _ENCRYPTION_KEY_NUM_BYTES = 32;
const _MAC_KEY_NUM_BYTES = 32;

class BlocksDevCredentialsManager implements BlocksDevCredentialsInterface {
    _devCredentialsJsonFilePath: string;
    _keyIfExists: string | null;
    _developerCredentialsObjIfExists: DeveloperCredentialsObject | null;

    constructor(devCredentialsJsonFilePath: string) {
        this._devCredentialsJsonFilePath = devCredentialsJsonFilePath;
        this._resolveDevCredentialsObjFromLayerIfExists();
        this._getBlockDeveloperCredentialsKeyIfExists();
    }

    _resolveDevCredentialsObjFromLayerIfExists(): void {
        try {
            // flow-disable-next-line since this will be available as part of a Lambda layer
            this._developerCredentialsObjIfExists = require(this._devCredentialsJsonFilePath);
        } catch {
            this._developerCredentialsObjIfExists = null;
        }
    }

    _getBlockDeveloperCredentialsKeyIfExists(): void {
        this._keyIfExists = process.env.BLOCK_DEVELOPER_CREDENTIALS_KEY || null;
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
     * @see server_shared/crypto/cryptopacker in hyperbase repo
     */
    _decryptCredentials(envelope: string): string {
        const crypto = require('crypto');

        // NOTE(richsinn): We would use base64_strict to decode Base 64. But
        //  for the same reason we can't use Cryptopacker due to lack of shared dependency
        //  management, we're skipping base64_strict check here.
        const envelopeBuffer = Buffer.from(envelope, 'base64');
        invariant(this._keyIfExists, 'this._keyIfExists');
        const keyBuffer = Buffer.from(this._keyIfExists, 'base64');
        const keyForEncryption = keyBuffer.slice(0, _ENCRYPTION_KEY_NUM_BYTES);
        const macKey = keyBuffer.slice(_MAC_KEY_NUM_BYTES);

        const {iv, cipherText, mac} = this._splitEnvelope(envelopeBuffer);

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

    _splitEnvelope(envelope: Buffer): {iv: Buffer, cipherText: Buffer, mac: Buffer} {
        const cipherTextStart = _IV_NUM_BYTES;
        const macStart = envelope.length - _MAC_NUM_BYTES;

        const iv = envelope.slice(0, cipherTextStart);
        const cipherText = envelope.slice(cipherTextStart, macStart);
        const mac = envelope.slice(macStart);

        return {iv, cipherText, mac};
    }

    getDeveloperCredentialByNameIfExists(): {[string]: string} | null {
        if (this._developerCredentialsObjIfExists === null) {
            return null;
        }

        const {developerCredentialsEncrypted} = this._developerCredentialsObjIfExists;
        if (!developerCredentialsEncrypted) {
            return null;
        }

        const developerCredentialByNameDecrypted = this._decryptCredentials(
            developerCredentialsEncrypted,
        );
        return JSON.parse(developerCredentialByNameDecrypted);
    }
}

module.exports = BlocksDevCredentialsManager;
