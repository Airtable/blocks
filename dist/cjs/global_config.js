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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _permission_levels = require("./types/permission_levels");

var _watchable = _interopRequireDefault(require("./watchable"));

var _get_sdk = _interopRequireDefault(require("./get_sdk"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var blockKvHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/blocks/block_kv_helpers');

var permissionHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/permissions/permission_helpers');

var forkObjectPathForWriteByReference = window.__requirePrivateModuleFromAirtable('client_server_shared/fork_object_path_for_write_by_reference');

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
 * @example
 * import {globalConfig} from 'airtable-block';
 */
class GlobalConfig extends _watchable.default {
  static _isWatchableKey(key) {
    // The user can store any arbitrary key in the global config, so there's
    // not much we can do here to check if a key is valid.
    return true;
  }

  constructor(initialKvValuesByKey, airtableInterface) {
    super();
    this._kvStore = initialKvValuesByKey;
    this._airtableInterface = airtableInterface;
  }

  __getTopLevelKey(key) {
    if (Array.isArray(key)) {
      return key[0];
    }

    return key;
  }

  __formatKeyAsPath(key) {
    if (!Array.isArray(key)) {
      return [key];
    }

    return key;
  }
  /** */


  get(key) {
    var path = this.__formatKeyAsPath(key);

    var pathValidationResult = blockKvHelpers.validateKvKeyPath(path, this._kvStore);

    if (!pathValidationResult.isValid) {
      throw new Error("Invalid globalConfig path: ".concat(pathValidationResult.reason));
    }

    var value = u.get(this._kvStore, path);
    return value;
  }
  /** */


  canSet(key) {
    // This takes the key to future-proof against having per-key
    // permissions.
    // For now, just need at least edit permissions to update globalConfig.
    var _getSdk = (0, _get_sdk.default)(),
        base = _getSdk.base;

    return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
  }
  /** */


  set(key, value) {
    var path = this.__formatKeyAsPath(key);

    return this.setPaths([{
      path,
      value
    }]);
  }
  /** */


  canSetPaths(updates) {
    // This takes the updates to future-proof against having per-key
    // permissions.
    // For now, just need at least edit permissions to update globalConfig.
    var _getSdk2 = (0, _get_sdk.default)(),
        base = _getSdk2.base;

    return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
  }
  /** */


  setPaths(updates) {
    // We check here, instead of deeper (e.g. on the liveapp side) so the user
    // gets a more useful error stack trace.
    if (!this.canSetPaths(updates)) {
      throw new Error('Your permission level does not allow setting globalConfig values');
    }

    this._setMultipleKvPaths(updates); // Now send the update to Airtable.


    var completionPromise = this._airtableInterface.setMultipleKvPathsAsync(updates);

    return {
      completion: completionPromise
    };
  }

  _setMultipleKvPaths(updates) {
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

  __onSetMultipleKvPaths(updates) {
    this._setMultipleKvPaths(updates);
  }

}

(0, _defineProperty2.default)(GlobalConfig, "_className", 'GlobalConfig');
var _default = GlobalConfig;
exports.default = _default;