// @flow
const {h, u} = require('client_server_shared/hu');
const utils = require('client/blocks/sdk/utils');
const AbstractModel = require('client/blocks/sdk/models/abstract_model');
const columnTypeProvider = require('client_server_shared/column_types/column_type_provider');
const Aggregators = require('client/blocks/sdk/models/aggregators');
const liveappSummaryFunctionKeyByAggregatorKey = require('client/blocks/sdk/models/liveapp_summary_function_key_by_aggregator_key');
const ColumnTypes = require('client_server_shared/column_types/column_types');
const cellValueUtils = require('client/blocks/sdk/models/cell_value_utils');

import type {BaseDataForBlocks, FieldDataForBlocks} from 'client/blocks/blocks_model_bridge/blocks_model_bridge';
import type TableType from 'client/blocks/sdk/models/table';
import type {Aggregator} from 'client/blocks/sdk/models/aggregators';
import type {ColumnType} from 'client_server_shared/column_types/column_types';

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableFieldKeys = {
    name: 'name',
    config: 'config',
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
    /** */
    get config(): {type: string, options: Object | null} {
        const {type, options} = columnTypeProvider.getConfigForPublicApi(
            this.__getRawType(),
            this.__getRawTypeOptions(),
            this.parentTable.parentBase.__appBlanket,
            this.parentTable.__getFieldNamesById(),
        );

        return {
            type,
            options: options ? utils.cloneDeep(options) : null,
        };
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
            const liveappSummaryFunctionKey = liveappSummaryFunctionKeyByAggregatorKey[aggregator.key];
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
            this._parentTable._parentBase.__appBlanket,
        );

        return cellValueUtils.getPublicCellValueFromPrivateCellValue(privateCellValue, this);

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
    }
}

module.exports = Field;
