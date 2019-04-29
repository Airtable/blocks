// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const utils = require('../private_utils');
const AbstractModel = require('./abstract_model');
const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);
const Aggregators = require('./aggregators');
const liveappSummaryFunctionKeyByAggregatorKey = require('./liveapp_summary_function_key_by_aggregator_key');
const ColumnTypes = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_types',
);
const ApiCellFormats = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/api_cell_formats',
);
const {PublicApiVersions} = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/api_versions',
);

import type {
    BaseDataForBlocks,
    FieldDataForBlocks,
} from 'client_server_shared/blocks/block_sdk_init_data';
import type TableType from './table';
import type {Aggregator} from './aggregators';
import type {ColumnType} from 'client_server_shared/column_types/column_types';

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableFieldKeys = {
    name: 'name',
    config: 'config',
    type: 'type',
    options: 'options',
    isComputed: 'isComputed',
};

export type WatchableFieldKey = $Keys<typeof WatchableFieldKeys>;

/** Model class representing a field in a table. */
class Field extends AbstractModel<FieldDataForBlocks, WatchableFieldKey> {
    static _className = 'Field';
    static _isWatchableKey(key: string) {
        return utils.isEnumValue(WatchableFieldKeys, key);
    }
    _parentTable: TableType;
    constructor(baseData: BaseDataForBlocks, parentTable: TableType, fieldId: string) {
        super(baseData, fieldId);

        this._parentTable = parentTable;
    }
    get _dataOrNullIfDeleted(): FieldDataForBlocks | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        return tableData.fieldsById[this._id] || null;
    }
    /** */
    get parentTable(): TableType {
        return this._parentTable;
    }
    /** */
    get name(): string {
        return this._data.name;
    }
    /** Deprecated. Use field.type and field.options instead. */
    get config(): {type: string, options: Object | null} {
        // TODO: add separate methods for getting type and options and
        // use them in the type and options getters below. We're currently
        // doing unnecessary work when `get type()` is called.
        const {type, options} = columnTypeProvider.getConfigForPublicApi(
            this.__getRawType(),
            this.__getRawTypeOptions(),
            this.parentTable.parentBase.__appInterface,
            this.parentTable.__getFieldNamesById(),
        );

        return {
            type,
            options: options ? utils.cloneDeep(options) : null,
        };
    }
    /** */
    get type(): string {
        return this.config.type;
    }
    /** */
    get options(): Object | null {
        return this.config.options;
    }
    /** */
    get isComputed(): boolean {
        const isComputed = columnTypeProvider.isComputed(this.__getRawType());
        return isComputed;
    }
    /**
     * Every table has exactly one primary field. True if this field is
     * its parent table's primary field.
     */
    get isPrimaryField(): boolean {
        return this.id === this.parentTable.primaryField.id;
    }
    /** */
    get availableAggregators(): Array<Aggregator> {
        const possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(
            this.__getRawType(),
            this.__getRawTypeOptions(),
        );
        return u.filter(Aggregators, aggregator => {
            const liveappSummaryFunctionKey =
                liveappSummaryFunctionKeyByAggregatorKey[aggregator.key];
            return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
        });
    }
    /** */
    isAggregatorAvailable(aggregator: Aggregator | string): boolean {
        const aggregatorKey = typeof aggregator === 'string' ? aggregator : aggregator.key;
        const liveappSummaryFunctionKey = liveappSummaryFunctionKeyByAggregatorKey[aggregatorKey];

        const possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(
            this.__getRawType(),
            this.__getRawTypeOptions(),
        );
        return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
    }
    /**
     * Given a string, will attempt to parse it and return a valid cell value for
     * the field's current config.
     */
    convertStringToCellValue(string: string): mixed {
        // TODO(jb): figure out 'cacheForBulkConversion'
        const privateCellValue = columnTypeProvider.convertStringToCellValue(
            string,
            this.__getRawType(),
            this.__getRawTypeOptions(),
            this.parentTable.parentBase.__appInterface,
        );

        const publicCellValue = columnTypeProvider.formatCellValueForPublicApi(
            privateCellValue,
            this.__getRawType(),
            this.__getRawTypeOptions(),
            this.parentTable.parentBase.__appInterface,
            {cellFormat: ApiCellFormats.JSON, apiVersion: PublicApiVersions.API2},
        );
        const validationResult = columnTypeProvider.validatePublicApiCellValueForUpdate(
            publicCellValue,
            null,
            this.__getRawType(),
            this.__getRawTypeOptions(),
            this.parentTable.parentBase.__appInterface,
            PublicApiVersions.API2,
        );

        if (validationResult.isValid) {
            return publicCellValue;
        } else {
            return null;
        }
    }
    __getRawType(): ColumnType {
        return this._data.type;
    }
    __getRawTypeOptions(): ?Object {
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
    __getRawColumn(): {id: string, type: string, typeOptions: ?Object} {
        return {
            id: this.id,
            type: this.__getRawType(),
            typeOptions: this.__getRawTypeOptions(),
        };
    }
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
        if (dirtyPaths.name) {
            this._onChange(WatchableFieldKeys.name);
        }
        if (dirtyPaths.type || dirtyPaths.typeOptions) {
            this._onChange(WatchableFieldKeys.config);
        }
        if (dirtyPaths.type) {
            this._onChange(WatchableFieldKeys.type);

            // TODO: it would be better if we only trigger this when
            // we know isComputed changed.
            this._onChange(WatchableFieldKeys.isComputed);
        }
        if (dirtyPaths.typeOptions) {
            this._onChange(WatchableFieldKeys.options);
        }
    }
}

module.exports = Field;
