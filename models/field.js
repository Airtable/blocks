// @flow
const _ = require('client_server_shared/lodash.custom');
const utils = require('client/blocks/sdk/utils');
const AbstractModel = require('client/blocks/sdk/models/abstract_model');
const columnTypeProvider = require('client_server_shared/column_types/column_type_provider');
const Aggregators = require('client/blocks/sdk/models/aggregators');
const liveappSummaryFunctionKeyByAggregatorKey = require('client/blocks/sdk/models/liveapp_summary_function_key_by_aggregator_key');

import type {BaseDataForBlocks, FieldDataForBlocks} from 'client/blocks/blocks_model_bridge';
import type TableType from 'client/blocks/sdk/models/table';
import type {Aggregator} from 'client/blocks/sdk/models/aggregators';

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableFieldKeys = {
    name: 'name',
    config: 'config',
};

class Field extends AbstractModel<FieldDataForBlocks, $Keys<typeof WatchableFieldKeys>> {
    static _className = 'Field';
    static _isWatchableKey(key: string) {
        return utils.isEnumValue(WatchableFieldKeys, key);
    }
    _parentTable: TableType;
    constructor(baseData: BaseDataForBlocks, parentTable: TableType, fieldId: string) {
        super(baseData, fieldId);

        this._parentTable = parentTable;

        Object.freeze(this);
    }
    get _dataOrNullIfDeleted(): FieldDataForBlocks | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        return tableData.fieldsById[this._id] || null;
    }
    get parentTable(): TableType {
        return this._parentTable;
    }
    get name(): string {
        return this._data.name;
    }
    get config(): {type: string, options: any} { // eslint-disable-line flowtype/no-weak-types
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
    get availableAggregators(): Array<Aggregator> {
        const possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(
            this.__getRawType(),
            this.__getRawTypeOptions(),
        );
        return _.filter(Aggregators, aggregator => {
            const liveappSummaryFunctionKey = liveappSummaryFunctionKeyByAggregatorKey[aggregator.key];
            return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
        });
    }
    isAggregatorAvailable(aggregator: Aggregator | string): boolean {
        const aggregatorKey = typeof aggregator === 'string' ? aggregator : aggregator.key;
        const liveappSummaryFunctionKey = liveappSummaryFunctionKeyByAggregatorKey[aggregatorKey];

        const possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(
            this.__getRawType(),
            this.__getRawTypeOptions(),
        );
        return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
    }
    __getRawType(): string {
        return this._data.type;
    }
    __getRawTypeOptions(): any { // eslint-disable-line flowtype/no-weak-types
        return this._data.typeOptions;
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
