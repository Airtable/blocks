// @flow

const NAMESPACE_KEY_SEPARATOR = '$$';

/**
 * Wraps a Storage instance (e.g. localStorage or sessionStorage) and
 * automatically prefixes all keys with the namespace.
 *
 * This implements the Storage interface:
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
class NamespacedStorage {
    _storage: Storage;
    _namespaceWithSeparator: string;
    constructor(storage: Storage, namespace: string) {
        this._storage = storage;
        this._namespaceWithSeparator = namespace + NAMESPACE_KEY_SEPARATOR;
    }
    get length(): number {
        // This is slow.
        return this._getNamespacedKeys().length;
    }
    key(i: number) {
        // This is slow.
        const namespacedKeys = this._getNamespacedKeys();
        if (i < 0 || i >= namespacedKeys.length) {
            return null;
        }
        return this._getOriginalKey(namespacedKeys[i]);
    }
    getItem(key: string): ?string {
        return this._storage.getItem(this._getNamespacedKey(key));
    }
    setItem(key: string, value: string) {
        this._storage.setItem(this._getNamespacedKey(key), value);
    }
    removeItem(key: string) {
        this._storage.removeItem(this._getNamespacedKey(key));
    }
    clear() {
        // This is slow.
        const namespacedKeys = this._getNamespacedKeys();
        for (const namespacedKey of namespacedKeys) {
            this._storage.removeItem(namespacedKey);
        }
    }
    _getNamespacedKeys(): Array<string> {
        const length = this._storage.length;
        const namespacedKeys = [];
        for (let i = 0; i < length; i++) {
            const key = this._storage.key(i);
            if (key && this._isNamespacedKey(key)) {
                namespacedKeys.push(key);
            }
        }
        return namespacedKeys;
    }
    _isNamespacedKey(key: string): boolean {
        return key.substr(0, this._namespaceWithSeparator.length) === this._namespaceWithSeparator;
    }
    _getNamespacedKey(key: string): string {
        return `${this._namespaceWithSeparator}${key}`;
    }
    _getOriginalKey(namespacedKey: string): string {
        return namespacedKey.substr(this._namespaceWithSeparator.length);
    }
}

module.exports = NamespacedStorage;
