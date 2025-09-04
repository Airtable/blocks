/** @module @airtable/blocks/models: Base */ /** */
import {BaseCore, ChangedPathsForType, WatchableBaseKeys} from '../../shared/models/base_core';
import {MutationTypes} from '../types/mutations';
import {FieldType} from '../../shared/types/field_core';
import {PermissionCheckResult} from '../../shared/types/mutations_core';
import {BaseSdkMode} from '../../sdk_mode';
import {TableId} from '../../shared/types/hyper_ids';
import {entries} from '../../shared/private_utils';
import {BaseData} from '../types/base';
import BaseBlockSdk from '../sdk';
import RecordStore from './record_store';
import Table from './table';
import createAggregators, {Aggregators} from './create_aggregators';

/**
 * Model class representing a base.
 *
 * If you want the base model to automatically recalculate whenever the base schema changes, try the
 * {@link useBase} hook. Alternatively, you can manually subscribe to changes with
 * {@link useWatchable} (recommended) or [Base#watch](/api/models/Base#watch).
 *
 * @example
 * ```js
 * import {base} from '@airtable/blocks/base';
 *
 * console.log('The name of your base is', base.name);
 * ```
 * @docsPath models/Base
 */
class Base extends BaseCore<BaseSdkMode> {
    /** @internal */
    static _className = 'Base';

    _aggregators: Aggregators | null = null;

    /** @internal */
    _constructTable(tableId: TableId): Table {
        const recordStore = this.__getRecordStore(tableId);
        return new Table(this, recordStore, tableId, this._sdk);
    }

    /** @internal */
    _constructRecordStore(sdk: BaseBlockSdk, tableId: TableId): RecordStore {
        return new RecordStore(sdk, tableId);
    }

    /** @internal */
    _iterateTableIds(): Iterable<TableId> {
        return this._data.tableOrder;
    }

    /**
     * Aggregators can be used to compute aggregates for cell values.
     *
     * @example
     * ```js
     * import {base} from '@airtable/blocks/base';
     *
     * // To get a list of aggregators supported for a specific field:
     * const fieldAggregators = myField.availableAggregators;
     *
     * // To compute the total attachment size of an attachment field:
     * const aggregator = base.aggregators.totalAttachmentSize;
     * const value = aggregator.aggregate(myRecords, myAttachmentField);
     * const valueAsString = aggregate.aggregateToString(myRecords, myAttachmentField);
     * ```
     */
    get aggregators(): Aggregators {
        if (!this._aggregators) {
            this._aggregators = createAggregators(this._sdk);
        }
        return this._aggregators;
    }

    /**
     * Checks whether the current user has permission to create a table.
     *
     * Accepts partial input, in the same format as {@link createTableAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified record,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param name name for the table. must be case-insensitive unique
     * @param fields array of fields to create in the table
     *
     * @example
     * ```js
     * const createTableCheckResult = base.checkPermissionsForCreateTable();
     *
     * if (!createTableCheckResult.hasPermission) {
     *     alert(createTableCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionsForCreateTable(
        name?: string,
        fields?: Array<{
            name?: string;
            type?: FieldType;
            options?: {[key: string]: unknown} | null;
            description?: string | null;
        }>,
    ): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
            type: MutationTypes.CREATE_SINGLE_TABLE,
            id: undefined, 
            name: name,
            fields: fields?.map(field => {
                return {
                    name: field.name,
                    config: field.type
                        ? {
                              type: field.type,
                              ...(field.options ? {options: field.options} : null),
                          }
                        : undefined,
                    description: field.description,
                };
            }),
        });
    }

    /**
     * An alias for `checkPermissionsForCreateTable(name, fields).hasPermission`.
     *
     * Checks whether the current user has permission to create a table.
     *
     * Accepts partial input, in the same format as {@link createTableAsync}.
     *
     * @param name name for the table. must be case-insensitive unique
     * @param fields array of fields to create in the table
     *
     * @example
     * ```js
     * const canCreateTable = table.hasPermissionToCreateTable();
     *
     * if (!canCreateTable) {
     *     alert('not allowed!');
     * }
     * ```
     */
    hasPermissionToCreateTable(
        name?: string,
        fields?: Array<{
            name?: string;
            type?: FieldType;
            options?: {[key: string]: unknown} | null;
            description?: string | null;
        }>,
    ): boolean {
        return this.checkPermissionsForCreateTable(name, fields).hasPermission;
    }

    /**
     * Creates a new table.
     *
     * Throws an error if the user does not have permission to create a table, if an invalid
     * table name is provided, or if invalid fields are provided (invalid name, type, options or
     * description).
     *
     * Refer to {@link FieldType} for supported field types, the write format for field options, and
     * other specifics for certain field types.
     *
     * At least one field must be specified. The first field in the `fields` array will be used as
     * the table's [primary field](https://support.airtable.com/hc/en-us/articles/202624179-The-Name-Field)
     * and must be a supported primary field type. Fields must have case-insensitive unique names
     * within the table.
     *
     * A default grid view will be created with all fields visible.
     *
     * This action is asynchronous. Unlike new records, new tables are **not** created
     * optimistically locally. You must `await` the returned promise before using the new
     * table in your extension.
     *
     * @param name name for the table. must be case-insensitive unique
     * @param fields array of fields to create in the table: see below for an example. `name` and
     * `type` must be specified for all fields, while `options` is only required for fields that
     * have field options. `description` is optional and will be `''` if not specified or if
     * specified as `null`.
     *
     * @example
     * ```js
     * async function createNewTable() {
     *     const name = 'My new table';
     *     const fields = [
     *         // Name will be the primary field of the table.
     *         {name: 'Name', type: FieldType.SINGLE_LINE_TEXT, description: 'This is the primary field'},
     *         {name: 'Notes', type: FieldType.RICH_TEXT},
     *         {name: 'Attachments', type: FieldType.MULTIPLE_ATTACHMENTS},
     *         {name: 'Number', type: FieldType.NUMBER, options: {
     *             precision: 8,
     *         }},
     *         {name: 'Select', type: FieldType.SINGLE_SELECT, options: {
     *             choices: [
     *                 {name: 'A'},
     *                 {name: 'B'},
     *             ],
     *         }},
     *     ];
     *
     *     if (base.hasPermissionToCreateTable(name, fields)) {
     *         await base.createTableAsync(name, fields);
     *     }
     * }
     * ```
     */
    async createTableAsync(
        name: string,
        fields: Array<{
            name: string;
            type: FieldType;
            options?: {[key: string]: unknown} | null;
            description?: string | null;
        }>,
    ): Promise<Table> {
        const tableId = this._sdk.__airtableInterface.idGenerator.generateTableId();

        await this._sdk.__mutations.applyMutationAsync({
            id: tableId,
            type: MutationTypes.CREATE_SINGLE_TABLE,
            name,
            fields: fields.map(field => {
                return {
                    name: field.name,
                    config: {
                        type: field.type,
                        ...(field.options ? {options: field.options} : null),
                    },
                    description: field.description ?? null,
                };
            }),
        });

        return this.getTableById(tableId);
    }

    /**
     * @internal
     */
    __triggerOnChangeForChangedPaths(changedPaths: ChangedPathsForType<BaseData>): void {
        super.__triggerOnChangeForChangedPaths(changedPaths);

        let didSchemaChange = false;
        if (changedPaths.tableOrder) {
            this._onChange(WatchableBaseKeys.tables);
            didSchemaChange = true;

            for (const [tableId, tableModel] of entries(this._tableModelsById)) {
                if (tableModel.isDeleted) {
                    delete this._tableModelsById[tableId];
                }
            }

            for (const [tableId, recordStore] of entries(this._tableRecordStoresByTableId)) {
                if (recordStore && recordStore.isDeleted) {
                    recordStore.__onDataDeletion();
                    delete this._tableRecordStoresByTableId[tableId];
                }
            }
        }
        if (didSchemaChange) {
            this._onChange(WatchableBaseKeys.schema);
        }
    }
}

export default Base;
