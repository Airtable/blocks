"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.set");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _permission_levels = require("./types/permission_levels");

var _watchable = _interopRequireDefault(require("./watchable"));

var _get_sdk = _interopRequireDefault(require("./get_sdk"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var blockKvHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/blocks/block_kv_helpers');

var permissionHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/permissions/permission_helpers');

var forkObjectPathForWriteByReference = window.__requirePrivateModuleFromAirtable('client_server_shared/fork_object_path_for_write_by_reference');
/**
 * @typedef
 */


// NOTE: GlobalConfig is essentially a wrapper around a generic key-value store.
// It's called GlobalConfig in order to convey two main points about its intended
// usage:
// 1) that it is synced 'globally' across clients (at some point we might make
//    a UserConfig which would be scoped to an individual user), and
// 2) that is should be used mainly for configuration of the block (kv store
//    as a name seems a bit too vague in terms of intended usage).

/**
 * A key-value store for persisting configuration options for a block installation.
 *
 * The contents will be synced in real-time to all logged-in users of the installation.
 * Contents will not be updated in real-time when the installation is running in
 * a publicly shared base, or in development mode.
 *
 * Any key can be watched to know when the value of the key changes.
 *
 * You should not need to construct this object yourself.
 *
 * @example
 * import {globalConfig} from '@airtable/blocks';
 */
var GlobalConfig =
/*#__PURE__*/
function (_Watchable) {
  (0, _inherits2.default)(GlobalConfig, _Watchable);
  (0, _createClass2.default)(GlobalConfig, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      // The user can store any arbitrary key in the global config, so there's
      // not much we can do here to check if a key is valid.
      return true;
    }
  }]);

  /**
   * @hideconstructor
   */
  function GlobalConfig(initialKvValuesByKey, airtableInterface) {
    var _this;

    (0, _classCallCheck2.default)(this, GlobalConfig);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GlobalConfig).call(this));
    _this._kvStore = initialKvValuesByKey;
    _this._airtableInterface = airtableInterface;
    return _this;
  }
  /**
   * Get notified of changes to global config.
   *
   * You can watch any top-level key in global config.
   *
   * Every call to `.watch` should have a matching call to `.unwatch`.
   *
   * @function watch
   * @memberof GlobalConfig
   * @instance
   * @param {(WatchableGlobalConfigKey|Array<WatchableGlobalConfigKey>)} keys the keys to watch
   * @param {Function} callback a function to call when those keys change
   * @param {Object?} [context] an optional context for `this` in `callback`.
   * @returns {Array<WatchableGlobalConfigKey>} the array of keys that were watched
   */

  /**
   * Unwatch keys watched with `.watch`.
   *
   * Should be called with the same arguments given to `.watch`.
   *
   * @function unwatch
   * @memberof GlobalConfig
   * @instance
   * @param {(WatchableGlobalConfigKey|Array<WatchableGlobalConfigKey>)} keys the keys to unwatch
   * @param {Function} callback the function passed to `.watch` for these keys
   * @param {Object?} [context] the context that was passed to `.watch` for this `callback`
   * @returns {Array<WatchableGlobalConfigKey>} the array of keys that were unwatched
   */

  /**
   * @private
   */


  (0, _createClass2.default)(GlobalConfig, [{
    key: "__getTopLevelKey",
    value: function __getTopLevelKey(key) {
      if (Array.isArray(key)) {
        return key[0];
      }

      return key;
    }
    /**
     * @private
     */

  }, {
    key: "__formatKeyAsPath",
    value: function __formatKeyAsPath(key) {
      if (!Array.isArray(key)) {
        return [key];
      }

      return key;
    }
    /**
     * Get the value at a path. Throws an error if the path is invalid.
     *
     * @param {string|Array<string>} key A string for the top-level key, or an array of strings describing the path to the value.
     * @returns The value at the provided path.
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * const topLevelValue = globalConfig.get('topLevelKey');
     * const nestedValue = globalConfig.get(['topLevelKey', 'nested', 'deeply']);
     */

  }, {
    key: "get",
    value: function get(key) {
      var path = this.__formatKeyAsPath(key);

      var pathValidationResult = blockKvHelpers.validateKvKeyPath(path, this._kvStore);

      if (!pathValidationResult.isValid) {
        throw new Error("Invalid globalConfig path: ".concat(pathValidationResult.reason));
      }

      var value = u.get(this._kvStore, path);
      return value;
    }
    /**
     * Returns `true` if the current user can set the global config value at `key`, `false` otherwise.
     *
     * @param {string|Array<string>} key A string for the top-level key, or an array of strings describing the path to the value.
     * @returns `true` if the current user can set the global config value at `key`, and `false` otherwise.
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * if (globalConfig.canSet('favoriteColor')) {
     *     globalConfig.set('favoriteColor', 'purple');
     * }
     */

  }, {
    key: "canSet",
    value: function canSet(key) {
      // This takes the key to future-proof against having per-key
      // permissions.
      // For now, just need at least edit permissions to update globalConfig.
      var _getSdk = (0, _get_sdk.default)(),
          base = _getSdk.base;

      return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
    }
    /**
     * Sets a value at a path. Throws an error if the path or value is invalid.
     *
     * @param {string|Array<string>} key A string for the top-level key, or an array of strings describing the path to set.
     * @param value The value to set at the specified path.
     * @returns {{}}
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * if (globalConfig.canSet('favoriteColor')) {
     *     globalConfig.set('favoriteColor', 'purple');
     * }
     */

  }, {
    key: "set",
    value: function set(key, value) {
      var path = this.__formatKeyAsPath(key);

      return this.setPaths([{
        path,
        value
      }]);
    }
    /**
     * Returns `true` if the current user can perform the specified updates to global config, `false` otherwise.
     *
     * @param {Array<{path: (string|Array<string>), value: GlobalConfigValue}>} updates The paths and values to set.
     * @returns `true` if the current user can perform the specified updates to global config, `false` otherwise.
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * const updates = [
     *     {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
     *     {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
     * ];
     * if (globalConfig.canSetPaths(updates)) {
     *     globalConfig.setPaths(updates);
     * }
     */

  }, {
    key: "canSetPaths",
    value: function canSetPaths(updates) {
      // This takes the updates to future-proof against having per-key
      // permissions.
      // For now, just need at least edit permissions to update globalConfig.
      var _getSdk2 = (0, _get_sdk.default)(),
          base = _getSdk2.base;

      return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
    }
    /**
     * Sets multiple values. Throws if any path or value is invalid.
     *
     * @param {Array<{path: (string|Array<string>), value: GlobalConfigValue}>} updates The paths and values to set.
     * @returns {{}}
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * const updates = [
     *     {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
     *     {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
     * ];
     * if (globalConfig.canSetPaths(updates)) {
     *     globalConfig.setPaths(updates);
     * }
     */

  }, {
    key: "setPaths",
    value: function setPaths(updates) {
      // We check here, instead of deeper (e.g. on the liveapp side) so the user
      // gets a more useful error stack trace.
      if (!this.canSetPaths(updates)) {
        throw new Error('Your permission level does not allow setting globalConfig values');
      }

      (0, _get_sdk.default)().__applyGlobalConfigUpdates(updates); // Now send the update to Airtable.


      var completionPromise = this._airtableInterface.setMultipleKvPathsAsync(updates);

      return {
        completion: completionPromise
      };
    }
    /**
     * @private
     * this shouldn't be called directly - instead, use getSdk().__applyGlobalConfigUpdates()
     */

  }, {
    key: "__setMultipleKvPaths",
    value: function __setMultipleKvPaths(updates) {
      if (!Array.isArray(updates)) {
        throw new Error('globalConfig updates must be an array');
      }

      var topLevelKeySet = {}; // Create a working copy of the kvStore so that we can revert changes
      // in memory if the updates don't pass validation or limit checks.
      // First, let's shallow clone the starting kvStore.

      var clonedObjectsSet = new Set();
      var workingKvStore = u.clone(this._kvStore); // Before applying each update, fork the working kvStore so we can roll
      // back any changes we make.

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = updates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var update = _step.value;
          var updateValidationResult = blockKvHelpers.validateKvStoreUpdate(update, this._kvStore);

          if (!updateValidationResult.isValid) {
            throw new Error("Invalid globalConfig update: ".concat(updateValidationResult.reason));
          }

          forkObjectPathForWriteByReference(workingKvStore, this._kvStore, update.path, clonedObjectsSet);
          blockKvHelpers.applyValidatedUpdateToKvStoreByReference(workingKvStore, update);
          var topLevelKey = update.path[0];
          topLevelKeySet[topLevelKey] = true;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var limitCheckResult = blockKvHelpers.limitCheckKvStore(workingKvStore, Object.keys(topLevelKeySet));

      if (!limitCheckResult.isValid) {
        throw new Error("globalConfig over limits: ".concat(limitCheckResult.reason));
      } // We passed validation and limit checks, so it's safe to persist the updates.


      this._kvStore = workingKvStore; // Now loop over the top level keys to fire change events.
      // NOTE: it's important that we do this after the loop above (instead of inline),
      // so that all of the changes are reflected by the time we trigger change events.

      for (var _i = 0, _Object$keys = Object.keys(topLevelKeySet); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];

        this._onChange(key);
      }
    }
  }]);
  return GlobalConfig;
}(_watchable.default);

(0, _defineProperty2.default)(GlobalConfig, "_className", 'GlobalConfig');
var _default = GlobalConfig;
exports.default = _default;