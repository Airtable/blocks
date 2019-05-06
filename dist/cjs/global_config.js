"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

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

  function GlobalConfig(initialKvValuesByKey, airtableInterface) {
    var _this;

    (0, _classCallCheck2.default)(this, GlobalConfig);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GlobalConfig).call(this));
    _this._kvStore = initialKvValuesByKey;
    _this._airtableInterface = airtableInterface;
    return _this;
  }

  (0, _createClass2.default)(GlobalConfig, [{
    key: "__getTopLevelKey",
    value: function __getTopLevelKey(key) {
      if ((0, _isArray.default)(key)) {
        return key[0];
      }

      return key;
    }
  }, {
    key: "__formatKeyAsPath",
    value: function __formatKeyAsPath(key) {
      if (!(0, _isArray.default)(key)) {
        return [key];
      }

      return key;
    }
    /** */

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
    /** */

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
    /** */

  }, {
    key: "set",
    value: function set(key, value) {
      var path = this.__formatKeyAsPath(key);

      return this.setPaths([{
        path: path,
        value: value
      }]);
    }
    /** */

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
    /** */

  }, {
    key: "setPaths",
    value: function setPaths(updates) {
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
  }, {
    key: "_setMultipleKvPaths",
    value: function _setMultipleKvPaths(updates) {
      if (!(0, _isArray.default)(updates)) {
        throw new Error('globalConfig updates must be an array');
      }

      var topLevelKeySet = {}; // Create a working copy of the kvStore so that we can revert changes
      // in memory if the updates don't pass validation or limit checks.
      // First, let's shallow clone the starting kvStore.

      var clonedObjectsSet = new _set.default();
      var workingKvStore = u.clone(this._kvStore); // Before applying each update, fork the working kvStore so we can roll
      // back any changes we make.

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2.default)(updates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

      var limitCheckResult = blockKvHelpers.limitCheckKvStore(workingKvStore, (0, _keys.default)(topLevelKeySet));

      if (!limitCheckResult.isValid) {
        throw new Error("globalConfig over limits: ".concat(limitCheckResult.reason));
      } // We passed validation and limit checks, so it's safe to persist the updates.


      this._kvStore = workingKvStore; // Now loop over the top level keys to fire change events.
      // NOTE: it's important that we do this after the loop above (instead of inline),
      // so that all of the changes are reflected by the time we trigger change events.

      for (var _i = 0, _Object$keys2 = (0, _keys.default)(topLevelKeySet); _i < _Object$keys2.length; _i++) {
        var key = _Object$keys2[_i];

        this._onChange(key);
      }
    }
  }, {
    key: "__onSetMultipleKvPaths",
    value: function __onSetMultipleKvPaths(updates) {
      this._setMultipleKvPaths(updates);
    }
  }]);
  return GlobalConfig;
}(_watchable.default);

(0, _defineProperty2.default)(GlobalConfig, "_className", 'GlobalConfig');
var _default = GlobalConfig;
exports.default = _default;