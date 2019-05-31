"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _private_utils = require("../private_utils");

var _table = _interopRequireDefault(require("./table"));

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    h = _window$__requirePriv.h,
    u = _window$__requirePriv.u;

var permissionHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/permissions/permission_helpers');

var appBlanketUserObjMethods = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/helpers/app_blanket_user_obj_methods');

var UserScopedAppInterface = window.__requirePrivateModuleFromAirtable('client_server_shared/user_scoped_app_interface');

var _window$__requirePriv2 = window.__requirePrivateModuleFromAirtable('client_server_shared/client_server_shared_config_settings'),
    PUBLIC_READ_ONLY_SHARE_OR_PRINT_USER_ID = _window$__requirePriv2.PUBLIC_READ_ONLY_SHARE_OR_PRINT_USER_ID; // How these model classes work:
//
// The single instance of the Base class maintains a reference to a plain JS
// object that contains all the data (baseData). All the other model classes
// receive a reference to baseData and traverse it to expose the data.
//
// As changes come in from liveapp, Base will apply them to the plain JS object.
// Since the other model classes have a reference to the same object, they'll
// always be accessing the most up-to-date values.
//
// Be careful not to return a reference to any non-primitive subtree of baseData,
// since the block developer could mutate it and we'll end up out of sync with
// liveapp.


var WatchableBaseKeys = Object.freeze({
  name: 'name',
  permissionLevel: 'permissionLevel',
  tables: 'tables',
  collaborators: 'collaborators'
});

/**
 * Model class representing a base.
 *
 * @example
 * import {base} from 'airtable-blocks';
 */
var Base =
/*#__PURE__*/
function (_AbstractModel) {
  (0, _inherits2.default)(Base, _AbstractModel);
  (0, _createClass2.default)(Base, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableBaseKeys, key);
    }
  }]);

  function Base(baseData, airtableInterface) {
    var _this;

    (0, _classCallCheck2.default)(this, Base);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Base).call(this, baseData, baseData.id));
    _this._tableModelsById = {}; // Table instances are lazily created by getTableById.

    _this._airtableInterface = airtableInterface;
    return _this;
  }

  (0, _createClass2.default)(Base, [{
    key: "_isFeatureEnabled",
    value: function _isFeatureEnabled(featureName) {
      return this._data.enabledFeatureNames.includes(featureName);
    }
  }, {
    key: "getCollaboratorByIdIfExists",

    /**
     * Returns the user matching the given ID, or `null` if that
     * user does not exist or does not have access to this base.
     */
    value: function getCollaboratorByIdIfExists(collaboratorId) {
      var appBlanket = this.__appBlanket;

      if (!appBlanket || !appBlanket.userInfoById) {
        return null;
      }

      var userObj = appBlanket.userInfoById[collaboratorId];

      if (!userObj) {
        return null;
      }

      return appBlanketUserObjMethods.formatUserObjForPublicApiV2(userObj);
    }
  }, {
    key: "getCollaboratorById",
    value: function getCollaboratorById(collaboratorId) {
      var collaborator = this.getCollaboratorByIdIfExists(collaboratorId);

      if (!collaborator) {
        throw new Error("No collaborator with ID ".concat(collaboratorId, " has access to base ").concat(this.id));
      }

      return collaborator;
    }
  }, {
    key: "getTableByIdIfExists",

    /**
     * Returns the table matching the given ID, or `null` if that
     * table does not exist in this base.
     */
    value: function getTableByIdIfExists(tableId) {
      if (!this._data.tablesById[tableId]) {
        return null;
      } else {
        if (!this._tableModelsById[tableId]) {
          this._tableModelsById[tableId] = new _table.default(this._data, this, tableId, this._airtableInterface);
        }

        return this._tableModelsById[tableId];
      }
    }
  }, {
    key: "getTableById",
    value: function getTableById(tableId) {
      var table = this.getTableByIdIfExists(tableId);

      if (!table) {
        throw new Error("No table with ID ".concat(tableId, " in base ").concat(this.id));
      }

      return table;
    }
    /**
     * Returns the table matching the given name, or `null` if no table
     * exists with that name in this base.
     */

  }, {
    key: "getTableByNameIfExists",
    value: function getTableByNameIfExists(tableName) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _private_utils.entries)(this._data.tablesById)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
              tableId = _step$value[0],
              tableData = _step$value[1];

          if (tableData.name === tableName) {
            return this.getTableByIdIfExists(tableId);
          }
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

      return null;
    }
  }, {
    key: "getTableByName",
    value: function getTableByName(tableName) {
      var table = this.getTableByNameIfExists(tableName);

      if (!table) {
        throw new Error("No table named ".concat(tableName, " in base ").concat(this.id));
      }

      return table;
    }
  }, {
    key: "__triggerOnChangeForChangedPaths",
    value: function __triggerOnChangeForChangedPaths(changedPaths) {
      if (changedPaths.name) {
        this._onChange(WatchableBaseKeys.name);
      }

      if (changedPaths.permissionLevel) {
        this._onChange(WatchableBaseKeys.permissionLevel);
      }

      if (changedPaths.tableOrder) {
        this._onChange(WatchableBaseKeys.tables); // Clean up deleted tables


        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = (0, _private_utils.entries)(this._tableModelsById)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
                tableId = _step2$value[0],
                tableModel = _step2$value[1];

            if (tableModel.isDeleted) {
              delete this._tableModelsById[tableId];
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      var tablesById = changedPaths.tablesById;

      if (tablesById) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = (0, _private_utils.entries)(tablesById)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = (0, _slicedToArray2.default)(_step3.value, 2),
                tableId = _step3$value[0],
                dirtyTablePaths = _step3$value[1];

            // Directly access from _tableModelsById to avoid creating
            // a table model if it doesn't already exist. If it doesn't exist,
            // nothing can be subscribed to any events on it.
            var table = this._tableModelsById[tableId];

            if (table) {
              table.__triggerOnChangeForDirtyPaths(dirtyTablePaths);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }

      if (changedPaths.appBlanket) {
        this._onChange(WatchableBaseKeys.collaborators);
      }
    }
  }, {
    key: "__applyChangesWithoutTriggeringEvents",
    value: function __applyChangesWithoutTriggeringEvents(changes) {
      // Internal method.
      // After applying all changes, changedPaths will have the same shape as
      // the subset of this._data that changed. For example, if some table's
      // name changes, changedPaths will be {tablesById: {tbl123: name: {_isDirty: true}}}.
      // Use it to call __triggerOnChangeForChangedPaths to trigger change events for
      // effected models
      var changedPaths = {};
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = changes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var change = _step4.value;

          this._applyChange(change.path, change.value, changedPaths);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return changedPaths;
    }
  }, {
    key: "_applyChange",
    value: function _applyChange(path, value, changedPathsByRef) {
      var dataSubtree = this._data;
      var dirtySubtree = changedPathsByRef;

      for (var i = 0; i < path.length - 1; i++) {
        var part = path[i];

        if (!dataSubtree[part]) {
          // Certain fields are stored sparsely (e.g. cellValuesByFieldId),
          // so create an object on demand if needed.
          dataSubtree[part] = {};
        }

        dataSubtree = dataSubtree[part];

        if (!dirtySubtree[part]) {
          dirtySubtree[part] = {};
        }

        (0, _invariant.default)(dirtySubtree[part], 'dirtySubtree');
        dirtySubtree = dirtySubtree[part];
      }

      var lastPathPart = path[path.length - 1];
      var didChange = !u.isEqual(dataSubtree[lastPathPart], value);

      if (value === undefined) {
        delete dataSubtree[lastPathPart];
      } else {
        dataSubtree[lastPathPart] = value;
      }

      if (didChange) {
        if (!dirtySubtree[lastPathPart]) {
          dirtySubtree[lastPathPart] = {};
        }

        (0, _invariant.default)(dirtySubtree[lastPathPart], 'dirtySubtree');
        dirtySubtree[lastPathPart]._isDirty = true;
      }
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      return this._baseData;
    }
    /** The name of the base. */

  }, {
    key: "name",
    get: function get() {
      return this._data.name;
    }
    /**
     * The current user, or `null` if the block is running in a publicly shared base.
     */

  }, {
    key: "currentUser",
    get: function get() {
      var userId = this._data.currentUserId;

      if (!userId) {
        return null;
      } else {
        return this.getCollaboratorByIdIfExists(userId);
      }
    }
  }, {
    key: "__rawPermissionLevel",
    get: function get() {
      return this._data.permissionLevel;
    }
    /**
     * The current user's permission level.
     *
     * The value of this should not be consumed and will be deprecated.
     * To know whether a user can perform an action, use the more specific
     * `can` method.
     *
     * Can be watched to know when the user's permission level changes. Usually,
     * you'll want to watch this in your root component and re-render your whole
     * block when the permission level changes.
     *
     * @example
     * if (globalConfig.canSet('foo')) {
     *     globalConfig.set('foo', 'bar');
     * }
     *
     * @example
     * if (record.canSetCellValue('Name', 'Chair')) {
     *     record.setCellValue('Name', 'Chair');
     * }
     */

  }, {
    key: "permissionLevel",
    get: function get() {
      return permissionHelpers.getPublicApiNameForPermissionLevel(this._data.permissionLevel);
    }
    /**
     * The tables in this base. Can be watched to know when tables are created,
     * deleted, or reordered in the base.
     */

  }, {
    key: "tables",
    get: function get() {
      // TODO(kasra): cache and freeze this so it isn't O(n)
      var tables = [];

      this._data.tableOrder.forEach(tableId => {
        var table = this.getTableByIdIfExists(tableId); // NOTE: A table's ID may be in tableOrder without the table appearing
        // in tablesById, in which case getTableById will return null. This
        // happens if table was just created by the user, since we
        // wait for the push payload to deliver the table schema.

        if (table) {
          tables.push(table);
        }
      });

      return tables;
    }
    /**
     * The users who have access to this base.
     */

  }, {
    key: "activeCollaborators",
    get: function get() {
      var collaborators = [];
      var appBlanket = this.__appBlanket;

      if (appBlanket) {
        var userInfoById = appBlanket.userInfoById; // Exclude invites and former collaborators.

        if (userInfoById) {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = (0, _private_utils.values)(userInfoById)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var userObj = _step5.value;

              if (appBlanketUserObjMethods.isActive(userObj) && !h.id.isInviteId(userObj.id)) {
                collaborators.push(appBlanketUserObjMethods.formatUserObjForPublicApiV2(userObj));
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }
      }

      return collaborators;
    }
  }, {
    key: "__appBlanket",
    get: function get() {
      return this._data.appBlanket;
    }
  }, {
    key: "__appInterface",
    get: function get() {
      return new UserScopedAppInterface({
        applicationId: this.id,
        appBlanket: this._data.appBlanket,
        sortTiebreakerKey: this._data.sortTiebreakerKey,
        currentSessionUserId: this._data.currentUserId || PUBLIC_READ_ONLY_SHARE_OR_PRINT_USER_ID,
        isFeatureEnabled: featureName => this._isFeatureEnabled(featureName)
      });
    }
  }]);
  return Base;
}(_abstract_model.default);

(0, _defineProperty2.default)(Base, "_className", 'Base');
var _default = Base;
exports.default = _default;