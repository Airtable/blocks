import {BlockRunContextType} from '../types/airtable_interface';
import {ModelChange} from '../../shared/types/base_core';
import {Mutation, MutationTypes} from '../types/mutations';
import {spawnError, spawnUnknownSwitchCaseError} from '../../shared/error_utils';
import {FieldId} from '../../shared/types/hyper_ids';
import {
    MAX_FIELD_NAME_LENGTH,
    MAX_FIELD_DESCRIPTION_LENGTH,
    MAX_TABLE_NAME_LENGTH,
    MAX_NUM_FIELDS_PER_TABLE,
} from '../../shared/types/mutation_constants';
import {MutationsCore} from '../../shared/models/mutations_core';
import {BaseSdkMode} from '../../sdk_mode';
import {RecordData} from '../types/record';
import Table from './table';
import RecordStore from './record_store';

/** @hidden */
class Mutations extends MutationsCore<BaseSdkMode> {
    /** @internal */
    _isRecordStoreReadyForMutations(recordStore: RecordStore): boolean {
        return recordStore.isRecordMetadataLoaded;
    }

    /** @internal */
    _isFieldAvailableForMutation(recordStore: RecordStore, fieldId: FieldId): boolean {
        return recordStore.areCellValuesLoadedForFieldId(fieldId);
    }

    /** @internal */
    _getDefaultRecordProperties(): Partial<RecordData> {
        return {
            commentCount: 0,
            createdTime: new Date().toJSON(),
        };
    }

    /** @internal */
    _assertMutationIsValid(mutation: Mutation): void {

        const appInterface = this._sdk.__appInterface;
        const billingPlanGrouping = this._base.__billingPlanGrouping;

        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS:
            case MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES:
            case MutationTypes.CREATE_MULTIPLE_RECORDS:
            case MutationTypes.DELETE_MULTIPLE_RECORDS: {
                super._assertMutationIsValid(mutation);
                return;
            }

            case MutationTypes.CREATE_SINGLE_FIELD: {
                const {tableId, name, config, description} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't create field: No table with id %s exists", tableId);
                }

                if (table.fields.length >= MAX_NUM_FIELDS_PER_TABLE) {
                    throw spawnError(
                        "Can't create field: table already has the maximum of %s fields",
                        MAX_NUM_FIELDS_PER_TABLE,
                    );
                }

                this._assertFieldNameIsValidForMutation(name, table);

                const validationResult = this._airtableInterface.fieldTypeProvider.validateConfigForUpdate(
                    appInterface,
                    config,
                    null,
                    null,
                    billingPlanGrouping,
                );

                if (!validationResult.isValid) {
                    throw spawnError(
                        "Can't create field: invalid field config.\n%s",
                        validationResult.reason,
                    );
                }

                if (description && description.length > MAX_FIELD_DESCRIPTION_LENGTH) {
                    throw spawnError(
                        "Can't create field: description exceeds maximum length of %s characters",
                        MAX_FIELD_DESCRIPTION_LENGTH,
                    );
                }
                return;
            }

            case MutationTypes.UPDATE_SINGLE_FIELD_CONFIG: {
                const {tableId, id, config, opts} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't update field: No table with id %s exists", tableId);
                }

                const field = table.getFieldByIdIfExists(id);
                if (!field) {
                    throw spawnError("Can't update field: No field with id %s exists", id);
                }

                const currentConfig = this._airtableInterface.fieldTypeProvider.getConfig(
                    appInterface,
                    field._data,
                    field.parentTable.__getFieldNamesById(),
                );
                const validationResult = this._airtableInterface.fieldTypeProvider.validateConfigForUpdate(
                    appInterface,
                    config,
                    currentConfig,
                    field._data,
                    billingPlanGrouping,
                    opts,
                );

                if (!validationResult.isValid) {
                    throw spawnError(
                        "Can't update field: invalid field config.\n%s",
                        validationResult.reason,
                    );
                }
                return;
            }

            case MutationTypes.UPDATE_SINGLE_FIELD_DESCRIPTION: {
                const {tableId, id, description} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't update field: No table with id %s exists", tableId);
                }

                const field = table.getFieldByIdIfExists(id);
                if (!field) {
                    throw spawnError("Can't update field: No field with id %s exists", id);
                }

                if (description && description.length > MAX_FIELD_DESCRIPTION_LENGTH) {
                    throw spawnError(
                        "Can't update field: description exceeds maximum length of %s characters",
                        MAX_FIELD_DESCRIPTION_LENGTH,
                    );
                }
                return;
            }

            case MutationTypes.UPDATE_SINGLE_FIELD_NAME: {
                const {tableId, id, name} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't update field: No table with id %s exists", tableId);
                }

                const field = table.getFieldByIdIfExists(id);
                if (!field) {
                    throw spawnError("Can't update field: No field with id %s exists", id);
                }

                if (field.name.toLowerCase() !== name.toLowerCase()) {
                    this._assertFieldNameIsValidForMutation(name, table);
                }
                return;
            }

            case MutationTypes.CREATE_SINGLE_TABLE: {
                const {name, fields} = mutation;

                if (!name) {
                    throw spawnError("Can't create table: must provide non-empty name");
                }

                if (name.length > MAX_TABLE_NAME_LENGTH) {
                    throw spawnError(
                        "Can't create table: name '%s' exceeds maximum length of %s characters",
                        name,
                        MAX_TABLE_NAME_LENGTH,
                    );
                }

                const existingLowercaseTableNames = this._base.tables.map(table =>
                    table.name.toLowerCase(),
                );

                if (existingLowercaseTableNames.includes(name.toLowerCase())) {
                    throw spawnError(
                        "Can't create table: table with name '%s' already exists",
                        name,
                    );
                }

                if (fields.length === 0) {
                    throw spawnError("Can't create table: must specify at least one field");
                }

                if (fields.length > MAX_NUM_FIELDS_PER_TABLE) {
                    throw spawnError(
                        "Can't create table: number of fields exceeds maximum of %s",
                        MAX_NUM_FIELDS_PER_TABLE,
                    );
                }

                const lowercaseFieldNames = new Set();
                for (const field of fields) {
                    if (!field.name) {
                        throw spawnError(
                            "Can't create table: must provide non-empty name for every field",
                        );
                    }

                    if (field.name.length > MAX_FIELD_NAME_LENGTH) {
                        throw spawnError(
                            "Can't create table: field name '%s' exceeds maximum length of %s characters",
                            field.name,
                            MAX_FIELD_NAME_LENGTH,
                        );
                    }

                    const lowercaseFieldName = field.name.toLowerCase();
                    if (lowercaseFieldNames.has(lowercaseFieldName)) {
                        throw spawnError(
                            "Can't create table: duplicate field name '%s'",
                            field.name,
                        );
                    }
                    lowercaseFieldNames.add(lowercaseFieldName);

                    const validationResult = this._airtableInterface.fieldTypeProvider.validateConfigForUpdate(
                        appInterface,
                        field.config,
                        null,
                        null,
                        billingPlanGrouping,
                    );

                    if (!validationResult.isValid) {
                        throw spawnError(
                            "Can't create table: invalid field config for field '%s'.\n%s",
                            field.name,
                            validationResult.reason,
                        );
                    }

                    if (
                        field.description &&
                        field.description.length > MAX_FIELD_DESCRIPTION_LENGTH
                    ) {
                        throw spawnError(
                            "Can't create table: description for field '%s' exceeds maximum length of %s characters",
                            field.name,
                            MAX_FIELD_DESCRIPTION_LENGTH,
                        );
                    }
                }

                const primaryField = fields[0];
                if (
                    !this._airtableInterface.fieldTypeProvider.canBePrimary(
                        appInterface,
                        primaryField.config,
                        billingPlanGrouping,
                    )
                ) {
                    throw spawnError(
                        "Can't create table: first field '%s' has type '%s' which cannot be a primary field",
                        primaryField.name,
                        primaryField.config.type,
                    );
                }

                return;
            }
            case MutationTypes.UPDATE_VIEW_METADATA: {
                const {tableId, viewId} = mutation;
                const {runContext} = this._airtableInterface.sdkInitData;

                if (runContext.type !== BlockRunContextType.VIEW) {
                    throw spawnError('Setting view metadata is only valid for views');
                }

                if (runContext.viewId !== viewId || runContext.tableId !== tableId) {
                    throw spawnError('Custom views can only set view metadata on themselves');
                }

                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't update metadata: No table with id %s exists", tableId);
                }

                const view = table.getViewByIdIfExists(viewId);
                if (!view) {
                    throw spawnError("Can't update metadata: No view with id %s exists", viewId);
                }
                return;
            }

            default:
                throw spawnUnknownSwitchCaseError('mutation type', mutation, 'type');
        }
    }

    /** @internal */
    _assertFieldNameIsValidForMutation(name: string, table: Table) {
        if (!name) {
            throw spawnError("Can't create or update field: must provide non-empty name");
        }

        if (name.length > MAX_FIELD_NAME_LENGTH) {
            throw spawnError(
                "Can't create or update field: name '%s' exceeds maximum length of %s characters",
                name,
                MAX_FIELD_NAME_LENGTH,
            );
        }

        const existingLowercaseFieldNames = table.fields.map(field => field.name.toLowerCase());
        if (existingLowercaseFieldNames.includes(name.toLowerCase())) {
            throw spawnError(
                "Can't create or update field: field with name '%s' already exists",
                name,
            );
        }
    }

    /** @internal */
    _getOptimisticModelChangesForMutation(mutation: Mutation): Array<ModelChange> {
        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS:
            case MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES:
                return super._getOptimisticModelChangesForMutation(mutation);
            case MutationTypes.CREATE_MULTIPLE_RECORDS: {
                const {tableId, records} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);

                if (!recordStore.isRecordMetadataLoaded) {
                    return [];
                }

                const superChanges = super._getOptimisticModelChangesForMutation(mutation);
                return [
                    ...superChanges,
                    ...this._base.getTableById(tableId).views.flatMap(view => {
                        const viewDataStore = recordStore.getViewDataStore(view.id);
                        if (!viewDataStore.isDataLoaded) {
                            return [];
                        }
                        return viewDataStore.__generateChangesForParentTableAddMultipleRecords(
                            records.map(record => record.id),
                        );
                    }),
                ];
            }
            case MutationTypes.DELETE_MULTIPLE_RECORDS: {
                const {tableId, recordIds} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);
                if (!recordStore.isRecordMetadataLoaded) {
                    return [];
                }

                const superChanges = super._getOptimisticModelChangesForMutation(mutation);
                return [
                    ...superChanges,
                    ...this._base.getTableById(tableId).views.flatMap(view => {
                        const viewDataStore = recordStore.getViewDataStore(view.id);
                        if (!viewDataStore.isDataLoaded) {
                            return [];
                        }
                        return viewDataStore.__generateChangesForParentTableDeleteMultipleRecords(
                            recordIds,
                        );
                    }),
                ];
            }

            case MutationTypes.CREATE_SINGLE_FIELD:
            case MutationTypes.UPDATE_SINGLE_FIELD_CONFIG:
            case MutationTypes.UPDATE_SINGLE_FIELD_DESCRIPTION:
            case MutationTypes.UPDATE_SINGLE_FIELD_NAME:
            case MutationTypes.UPDATE_VIEW_METADATA:
            case MutationTypes.CREATE_SINGLE_TABLE: {
                return [];
            }

            default:
                throw spawnUnknownSwitchCaseError('mutation type', mutation, 'type');
        }
    }
}

export default Mutations;
