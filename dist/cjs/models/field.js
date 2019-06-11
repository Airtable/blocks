"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

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

var _permission_levels = require("../types/permission_levels");

var _private_utils = require("../private_utils");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

var _aggregators = _interopRequireDefault(require("./aggregators"));

var _liveapp_summary_function_key_by_aggregator_key = _interopRequireDefault(require("./liveapp_summary_function_key_by_aggregator_key"));

var columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

var ColumnTypes = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_types');

var ApiCellFormats = window.__requirePrivateModuleFromAirtable('client_server_shared/api_cell_formats');

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/api_versions'),
    PublicApiVersions = _window$__requirePriv.PublicApiVersions;

var permissionHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/permissions/permission_helpers'); // This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.


var WatchableFieldKeys = Object.freeze({
  name: 'name',
  type: 'type',
  options: 'options',
  isComputed: 'isComputed'
});

/**
 * Model class representing a field in a table.
 *
 * @example
 * import {base} from 'airtable-blocks';
 *
 * const table = base.getTableByName('Table 1');
 * const field = table.getFieldByName('Name');
 * console.log('The type of this field is', field.type);
 */
var Field =
/*#__PURE__*/
function (_AbstractModel) {
  (0, _inherits2.default)(Field, _AbstractModel);
  (0, _createClass2.default)(Field, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableFieldKeys, key);
    }
  }]);

  /**
   * @hideconstructor
   */
  function Field(baseData, parentTable, fieldId) {
    var _this;

    (0, _classCallCheck2.default)(this, Field);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Field).call(this, baseData, fieldId));
    _this._parentTable = parentTable;
    return _this;
  }
  /**
   * @private
   */


  (0, _createClass2.default)(Field, [{
    key: "_getConfig",

    /**
     * @private
     */
    value: function _getConfig() {
      // TODO: add separate methods for getting type and options and
      var _columnTypeProvider$g = columnTypeProvider.getConfigForPublicApi(this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, this.parentTable.__getFieldNamesById()),
          type = _columnTypeProvider$g.type,
          options = _columnTypeProvider$g.options;

      return {
        type,
        options: options ? (0, _private_utils.cloneDeep)(options) : null
      };
    }
    /**
     * @function
     * @returns The type of the field. Can be watched.
     * @example
     * console.log(myField.type);
     * // => 'singleLineText'
     */

  }, {
    key: "isAggregatorAvailable",

    /**
     * @function
     * @param aggregator The aggregator object or aggregator key.
     * @returns `true` if the given aggregator is available for this field, `false` otherwise.
     * @example
     * import {aggregators} from '@airtable/blocks/models';
     * const aggregator = aggregators.totalAttachmentSize;
     *
     * // Using an aggregator object
     * console.log(myAttachmentField.isAggregatorAvailable(aggregator));
     * // => true
     *
     * // Using an aggregator key
     * console.log(mySingleLineTextField.isAggregatorAvailable('totalAttachmentSize'));
     * // => false
     */
    value: function isAggregatorAvailable(aggregator) {
      var aggregatorKey = typeof aggregator === 'string' ? aggregator : aggregator.key;
      var liveappSummaryFunctionKey = _liveapp_summary_function_key_by_aggregator_key.default[aggregatorKey];
      var possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(this.__getRawType(), this.__getRawTypeOptions());
      return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
    }
    /**
     * Determines whether the current user has permission to update the cell values
     * in this field. Should be called before calling {@link Record#setCellValue} or
     * {@link Table#setCellValues}.
     *
     * @returns `true` if the current user has permission to update the cell values in this field, `false` otherwise.
     * @example
     * if (myField.canSetCellValues()) {
     *     myRecord.setCellValue(field, 'new cell value');
     * }
     */

  }, {
    key: "canSetCellValues",
    value: function canSetCellValues() {
      // For now, just need at least edit permissions. Once field locking is shipped,
      // this method should also check if the field is locked.
      var _getSdk = (0, _get_sdk.default)(),
          base = _getSdk.base;

      return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
    }
    /**
     * Given a string, will attempt to parse it and return a valid cell value for
     * the field's current config.
     *
     * @param string The string to parse.
     * @returns The parsed cell value, or `null` if unable to parse the given string.
     * @example
     * const inputString = '42';
     * const cellValue = myNumberField.convertStringToCellValue(inputString);
     * console.log(cellValue === 42);
     * // => true
     */

  }, {
    key: "convertStringToCellValue",
    value: function convertStringToCellValue(string) {
      // TODO(jb): figure out 'cacheForBulkConversion'
      var privateCellValue = columnTypeProvider.convertStringToCellValue(string, this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface);
      var publicCellValue = columnTypeProvider.formatCellValueForPublicApi(privateCellValue, this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, {
        cellFormat: ApiCellFormats.JSON,
        apiVersion: PublicApiVersions.API2
      });
      var validationResult = columnTypeProvider.validatePublicApiCellValueForUpdate(publicCellValue, null, this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, PublicApiVersions.API2);

      if (validationResult.isValid) {
        return publicCellValue;
      } else {
        return null;
      }
    }
    /**
     * @private
     */

  }, {
    key: "__getRawType",
    value: function __getRawType() {
      return this._data.type;
    }
    /**
     * @private
     */

  }, {
    key: "__getRawTypeOptions",
    value: function __getRawTypeOptions() {
      return this._data.typeOptions;
    }
    /**
     * @private
     */

  }, {
    key: "__getRawFormulaicResultType",
    value: function __getRawFormulaicResultType() {
      // Copied from liveapp column model.
      // We don't store resultType for count, for all intents and purposes on the
      // client side, counts should use a "number" resultType.
      if (this.__getRawType() === ColumnTypes.COUNT) {
        return ColumnTypes.NUMBER;
      } else {
        var typeOptions = this.__getRawTypeOptions();

        if (!typeOptions || typeOptions.resultType === undefined) {
          return null;
        } else {
          return typeOptions.resultType;
        }
      }
    }
    /**
     * @private
     */

  }, {
    key: "__getRawColumn",
    value: function __getRawColumn() {
      return {
        id: this.id,
        type: this.__getRawType(),
        typeOptions: this.__getRawTypeOptions()
      };
    }
    /**
     * @private
     */

  }, {
    key: "__triggerOnChangeForDirtyPaths",
    value: function __triggerOnChangeForDirtyPaths(dirtyPaths) {
      if (dirtyPaths.name) {
        this._onChange(WatchableFieldKeys.name);
      }

      if (dirtyPaths.type) {
        this._onChange(WatchableFieldKeys.type); // TODO: it would be better if we only trigger this when
        // we know isComputed changed.


        this._onChange(WatchableFieldKeys.isComputed);
      }

      if (dirtyPaths.typeOptions) {
        this._onChange(WatchableFieldKeys.options);
      }
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      var tableData = this._baseData.tablesById[this.parentTable.id];

      if (!tableData) {
        return null;
      }

      return tableData.fieldsById[this._id] || null;
    }
    /**
     * @function
     * @returns The table that this field belongs to. Should never change because fields aren't moved between tables.
     *
     * @example
     * const field = myTable.getFieldByName('Name');
     * console.log(field.parentTable.id === myTable.id);
     * // => true
     */

  }, {
    key: "parentTable",
    get: function get() {
      return this._parentTable;
    }
    /**
     * @function
     * @returns The name of the field. Can be watched.
     * @example
     * console.log(myField.name);
     * // => 'Name'
     */

  }, {
    key: "name",
    get: function get() {
      return this._data.name;
    }
  }, {
    key: "type",
    get: function get() {
      // TODO: add separate methods for getting type and options and
      var _columnTypeProvider$g2 = columnTypeProvider.getConfigForPublicApi(this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, this.parentTable.__getFieldNamesById()),
          type = _columnTypeProvider$g2.type;

      return type;
    }
    /**
     * @function
     * @returns The configuration options of the field. The structure of the field's
     * options depend on the field's type. Can be watched.
     * @example
     * import {fieldTypes} from '@airtable/blocks/models';
     *
     * if (myField.type === fieldTypes.CURRENCY) {
     *     console.log(myField.options.symbol);
     *     // => '$'
     * }
     */

  }, {
    key: "options",
    get: function get() {
      var _columnTypeProvider$g3 = columnTypeProvider.getConfigForPublicApi(this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, this.parentTable.__getFieldNamesById()),
          options = _columnTypeProvider$g3.options;

      return options ? (0, _private_utils.cloneDeep)(options) : null;
    }
    /**
     * @function
     * @returns `true` if this field is computed, `false` otherwise. A field is
     * "computed" if it's value is not set by user input (e.g. autoNumber, formula,
     * etc.). Can be watched.
     * @example
     * console.log(mySingleLineTextField.isComputed);
     * // => false
     * console.log(myAutoNumberField.isComputed);
     * // => true
     */

  }, {
    key: "isComputed",
    get: function get() {
      var isComputed = columnTypeProvider.isComputed(this.__getRawType());
      return isComputed;
    }
    /**
     * @function
     * @returns `true` if this field is its parent table's primary field, `false` otherwise.
     * Should never change because the primary field of a table cannot change.
     */

  }, {
    key: "isPrimaryField",
    get: function get() {
      return this.id === this.parentTable.primaryField.id;
    }
    /**
     * @function
     * @returns A list of available aggregators given this field's configuration.
     * @example
     * const fieldAggregators = myField.availableAggregators;
     */

  }, {
    key: "availableAggregators",
    get: function get() {
      var possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(this.__getRawType(), this.__getRawTypeOptions());
      return (0, _private_utils.values)(_aggregators.default).filter(aggregator => {
        var liveappSummaryFunctionKey = _liveapp_summary_function_key_by_aggregator_key.default[aggregator.key];
        return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
      });
    }
  }]);
  return Field;
}(_abstract_model.default);

(0, _defineProperty2.default)(Field, "_className", 'Field');
var _default = Field;
exports.default = _default;