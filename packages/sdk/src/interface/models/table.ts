import {ObjectPool} from '../../shared/models/object_pool';
import {TableCore} from '../../shared/models/table_core';
import {type InterfaceSdkMode} from '../../sdk_mode';
import {type FieldId, type RecordId} from '../../shared/types/hyper_ids';
import {type PermissionCheckResult} from '../../shared/types/mutations_core';
import {FieldType} from '../../shared/types/field_core';
import {type InterfaceBlockSdk} from '../sdk';
import {Field} from './field';
import {type Base} from './base';
import {type RecordStore} from './record_store';
import {TableQueryResult, type TableQueryResultOpts} from './table_query_result';

/**
 * Model class representing a table. Every {@link Base} has one or more tables.
 *
 * @example
 * ```js
 * import {useBase} from '@airtable/blocks/interface/ui';
 *
 * function App() {
 *     const base = useBase();
 *     const table = base.getTables()[0];
 *     if (table) {
 *         console.log('The name of this table is', table.name);
 *     }
 * }
 * ```
 * @docsPath models/Table
 */
export class Table extends TableCore<InterfaceSdkMode> {
    /**
     * Pool of `TableQueryResult` instances keyed by `__poolKey`. Callers
     * (currently `TableQueryResult` itself for strong registration) and
     * `Table.selectRecords` share this pool so identical opts return the
     * same pooled instance across calls/components.
     *
     * @internal
     */
    __tableQueryResultPool: ObjectPool<TableQueryResult, typeof TableQueryResult>;

    /** @internal */
    constructor(
        parentBase: Base,
        recordStore: RecordStore,
        tableId: string,
        sdk: InterfaceBlockSdk,
    ) {
        super(parentBase, recordStore, tableId, sdk);
        this.__tableQueryResultPool = new ObjectPool(TableQueryResult);
    }

    /** @internal */
    _constructField(fieldId: FieldId): Field {
        return new Field(this.parentBase.__sdk, this, fieldId);
    }

    /**
     * Select records from the table. Returns a {@link TableQueryResult}, which you
     * can pass to {@link useRecords} to handle loading/unloading and updating your UI
     * automatically.
     *
     * @param opts Options for the query, such as fields.
     * @example
     * ```js
     * import {useBase, useRecords} from '@airtable/blocks/interface/ui';
     *
     * function TodoList() {
     *     const base = useBase();
     *     const table = base.getTableByName('Tasks');
     *
     *     const queryResult = table.selectRecords({fields: ['Name']});
     *     const records = useRecords(queryResult);
     *
     *     return (
     *         <ul>
     *             {records.map(record => (
     *                 <li key={record.id}>
     *                     {record.getCellValueAsString('Name') || 'Unnamed record'}
     *                 </li>
     *             ))}
     *         </ul>
     *     );
     * }
     * ```
     */
    selectRecords(opts: TableQueryResultOpts = {}): TableQueryResult {
        const normalizedOpts = TableQueryResult._normalizeOpts(this, opts);
        return this.__tableQueryResultPool.getObjectForReuse(this._sdk, normalizedOpts);
    }

    /**
     * Select and load records from the table. Returns a {@link TableQueryResult} promise where
     * record data has been loaded.
     *
     * Consider using {@link useRecords} instead, unless you need to work with the
     * query result directly. Record hooks handle loading/unloading and updating your UI
     * automatically, but manually `select`ing records is useful for one-off data processing.
     *
     * Once you've finished with your query, remember to call `queryResult.unloadData()`.
     *
     * @param opts Options for the query, such as fields.
     * @example
     * ```js
     * async function logRecordCountAsync(table) {
     *     const query = await table.selectRecordsAsync({fields: ['Name']});
     *     console.log(query.recordIds.length);
     *     query.unloadData();
     * }
     * ```
     */
    async selectRecordsAsync(opts: TableQueryResultOpts = {}): Promise<TableQueryResult> {
        const queryResult = this.selectRecords(opts);
        await queryResult.loadDataAsync();
        return queryResult;
    }

    /**
     * Checks whether records in this table can be expanded.
     *
     * Returns `{hasPermission: true}` if records can be expanded,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise.
     *
     * @example
     * ```js
     * const expandRecordsCheckResult = table.checkPermissionToExpandRecords();
     * if (!expandRecordsCheckResult.hasPermission) {
     *     alert(expandRecordsCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionToExpandRecords(): PermissionCheckResult {
        const canExpand = this._baseData.tablesById[this.id].isRecordExpansionEnabled;
        return canExpand
            ? {hasPermission: true}
            : {
                  hasPermission: false,
                  reasonDisplayString: 'Record expansion is not enabled for this table',
              };
    }

    /**
     * An alias for `checkPermissionsForExpandRecords().hasPermission`.
     *
     * Whether records in this table can be expanded.
     *
     * @example
     * ```js
     * const isRecordExpansionEnabled = table.hasPermissionToExpandRecords();
     * if (isRecordExpansionEnabled) {
     *     expandRecord(record);
     * }
     * ```
     */
    hasPermissionToExpandRecords(): boolean {
        return this.checkPermissionToExpandRecords().hasPermission;
    }

    /** @internal */
    _adjustCellValueForFieldIfNecessary(
        field: Field,
        cellValue: unknown,
        onGenerateIdForNewForeignRecord: (recordId: RecordId) => void,
    ): unknown {
        if (field.type !== FieldType.MULTIPLE_RECORD_LINKS || !Array.isArray(cellValue)) {
            return cellValue;
        }
        return cellValue.map((item) => {
            if (typeof item !== 'object' || item === null) {
                return item;
            }

            if (!item.id) {
                const newForeignRecordId =
                    this.parentBase.__sdk.__airtableInterface.idGenerator.generateRecordId();
                onGenerateIdForNewForeignRecord(newForeignRecordId);
                return {
                    ...item,
                    id: newForeignRecordId,
                };
            }
            return item;
        });
    }
}
