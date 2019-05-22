"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _private_utils = _interopRequireDefault(require("../private_utils"));

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

var _aggregators = _interopRequireDefault(require("./aggregators"));

var _liveapp_summary_function_key_by_aggregator_key = _interopRequireDefault(require("./liveapp_summary_function_key_by_aggregator_key"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

const ColumnTypes = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_types');

const ApiCellFormats = window.__requirePrivateModuleFromAirtable('client_server_shared/api_cell_formats');

const {
  PublicApiVersions
} = window.__requirePrivateModuleFromAirtable('client_server_shared/api_versions'); // This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.


const WatchableFieldKeys = {
  name: 'name',
  config: 'config',
  type: 'type',
  options: 'options',
  isComputed: 'isComputed'
};

/** Model class representing a field in a table. */
class Field extends _abstract_model.default {
  static _isWatchableKey(key) {
    return _private_utils.default.isEnumValue(WatchableFieldKeys, key);
  }

  constructor(baseData, parentTable, fieldId) {
    super(baseData, fieldId);
    this._parentTable = parentTable;
  }

  get _dataOrNullIfDeleted() {
    const tableData = this._baseData.tablesById[this.parentTable.id];

    if (!tableData) {
      return null;
    }

    return tableData.fieldsById[this._id] || null;
  }
  /** */


  get parentTable() {
    return this._parentTable;
  }
  /** */


  get name() {
    return this._data.name;
  }

  _getConfig() {
    // TODO: add separate methods for getting type and options and
    const {
      type,
      options
    } = columnTypeProvider.getConfigForPublicApi(this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, this.parentTable.__getFieldNamesById());
    return {
      type,
      options: options ? _private_utils.default.cloneDeep(options) : null
    };
  }
  /** */


  get type() {
    // TODO: add separate methods for getting type and options and
    const {
      type
    } = columnTypeProvider.getConfigForPublicApi(this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, this.parentTable.__getFieldNamesById());
    return type;
  }
  /** */


  get options() {
    const {
      options
    } = columnTypeProvider.getConfigForPublicApi(this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, this.parentTable.__getFieldNamesById());
    return options ? _private_utils.default.cloneDeep(options) : null;
  }
  /** */


  get isComputed() {
    const isComputed = columnTypeProvider.isComputed(this.__getRawType());
    return isComputed;
  }
  /**
   * Every table has exactly one primary field. True if this field is
   * its parent table's primary field.
   */


  get isPrimaryField() {
    return this.id === this.parentTable.primaryField.id;
  }
  /** */


  get availableAggregators() {
    const possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(this.__getRawType(), this.__getRawTypeOptions());
    return (0, _filter.default)(u).call(u, _aggregators.default, aggregator => {
      const liveappSummaryFunctionKey = _liveapp_summary_function_key_by_aggregator_key.default[aggregator.key];
      return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
    });
  }
  /** */


  isAggregatorAvailable(aggregator) {
    const aggregatorKey = typeof aggregator === 'string' ? aggregator : aggregator.key;
    const liveappSummaryFunctionKey = _liveapp_summary_function_key_by_aggregator_key.default[aggregatorKey];
    const possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(this.__getRawType(), this.__getRawTypeOptions());
    return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
  }
  /**
   * Given a string, will attempt to parse it and return a valid cell value for
   * the field's current config.
   */


  convertStringToCellValue(string) {
    // TODO(jb): figure out 'cacheForBulkConversion'
    const privateCellValue = columnTypeProvider.convertStringToCellValue(string, this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface);
    const publicCellValue = columnTypeProvider.formatCellValueForPublicApi(privateCellValue, this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, {
      cellFormat: ApiCellFormats.JSON,
      apiVersion: PublicApiVersions.API2
    });
    const validationResult = columnTypeProvider.validatePublicApiCellValueForUpdate(publicCellValue, null, this.__getRawType(), this.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface, PublicApiVersions.API2);

    if (validationResult.isValid) {
      return publicCellValue;
    } else {
      return null;
    }
  }

  __getRawType() {
    return this._data.type;
  }

  __getRawTypeOptions() {
    return this._data.typeOptions;
  }

  __getRawFormulaicResultType() {
    // Copied from liveapp column model.
    // We don't store resultType for count, for all intents and purposes on the
    // client side, counts should use a "number" resultType.
    if (this.__getRawType() === ColumnTypes.COUNT) {
      return ColumnTypes.NUMBER;
    } else {
      const typeOptions = this.__getRawTypeOptions();

      if (!typeOptions || typeOptions.resultType === undefined) {
        return null;
      } else {
        return typeOptions.resultType;
      }
    }
  }

  __getRawColumn() {
    return {
      id: this.id,
      type: this.__getRawType(),
      typeOptions: this.__getRawTypeOptions()
    };
  }

  __triggerOnChangeForDirtyPaths(dirtyPaths) {
    if (dirtyPaths.name) {
      this._onChange(WatchableFieldKeys.name);
    }

    if (dirtyPaths.type || dirtyPaths.typeOptions) {
      this._onChange(WatchableFieldKeys.config);
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

}

(0, _defineProperty2.default)(Field, "_className", 'Field');
var _default = Field;
exports.default = _default;