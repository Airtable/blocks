import {AirtableInterface, BlockRunContextType} from '../types/airtable_interface';
import {ModelChange} from '../types/base';
import {Mutation, PartialMutation, PermissionCheckResult, MutationTypes} from '../types/mutations';
import {entries, ObjectMap} from '../private_utils';
import {spawnError, spawnUnknownSwitchCaseError} from '../error_utils';
import {GlobalConfigUpdate} from '../types/global_config';
import {FieldId} from '../types/field';
import Sdk from '../sdk';
import Session from './session';
import Base from './base';
import Field from './field';
import {
    MAX_FIELD_NAME_LENGTH,
    MAX_TABLE_NAME_LENGTH,
    MAX_NUM_FIELDS_PER_TABLE,
} from './mutation_constants';

const MUTATIONS_MAX_BATCH_SIZE = 50;

const MUTATIONS_MAX_BODY_SIZE = 1.9 * 1024 * 1024;

const MUTATION_HOLD_FOR_MS = 100;

/** @internal */
class Mutations {
    /** @internal */
    _airtableInterface: AirtableInterface;
    /** @internal */
    _session: Session;
    /** @internal */
    _sdk: Sdk;
    /** @internal */
    _base: Base;
    /** @internal */
    _applyModelChanges: (arg1: Array<ModelChange>) => void;
    /** @internal */
    _applyGlobalConfigUpdates: (arg1: ReadonlyArray<GlobalConfigUpdate>) => void;

    /** @hidden */
    constructor(
        sdk: Sdk,
        session: Session,
        base: Base,
        applyModelChanges: (arg1: ReadonlyArray<ModelChange>) => void,
        applyGlobalConfigUpdates: (arg1: ReadonlyArray<GlobalConfigUpdate>) => void,
    ) {
        this._airtableInterface = sdk.__airtableInterface;
        this._session = session;
        this._sdk = sdk;
        this._base = base;
        this._applyModelChanges = applyModelChanges;
        this._applyGlobalConfigUpdates = applyGlobalConfigUpdates;
    }

    /** @hidden */
    async applyMutationAsync(mutation: Mutation): Promise<void> {
        this._assertMutationIsValid(mutation);
        this._assertMutationUnderLimits(mutation);

        const permissionCheck = this.checkPermissionsForMutation(mutation);
        if (!permissionCheck.hasPermission) {
            throw spawnError(
                'Cannot apply %s mutation: %s',
                mutation.type,
                permissionCheck.reasonDisplayString,
            );
        }

        const didApplyOptimisticUpdates = this._applyOptimisticUpdatesForMutation(mutation);

        try {
            await this._airtableInterface.applyMutationAsync(mutation, {
                holdForMs: MUTATION_HOLD_FOR_MS,
            });
        } catch (err) {
            if (didApplyOptimisticUpdates) {
                setTimeout(() => {
                    throw err;
                }, 0);
                await new Promise(() => {});
            } else {
                throw err;
            }
        }
    }

    /** @hidden */
    checkPermissionsForMutation(mutation: PartialMutation): PermissionCheckResult {
        return this._airtableInterface.checkPermissionsForMutation(
            mutation,
            this._base.__getBaseData(),
        );
    }

    /** @internal */
    _assertMutationUnderLimits(mutation: Mutation) {
        if (encodeURIComponent(JSON.stringify(mutation)).length > MUTATIONS_MAX_BODY_SIZE) {
            throw spawnError(
                'Request exceeds maximum size limit of %s bytes',
                MUTATIONS_MAX_BODY_SIZE,
            );
        }

        if (this._doesMutationExceedBatchSizeLimit(mutation)) {
            throw spawnError(
                'Request exceeds maximum batch size limit of %s items',
                MUTATIONS_MAX_BATCH_SIZE,
            );
        }
    }

    /** @internal */
    _doesMutationExceedBatchSizeLimit(mutation: Mutation) {
        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES:
            case MutationTypes.CREATE_MULTIPLE_RECORDS:
                return mutation.records.length > MUTATIONS_MAX_BATCH_SIZE;
            case MutationTypes.DELETE_MULTIPLE_RECORDS:
                return mutation.recordIds.length > MUTATIONS_MAX_BATCH_SIZE;
            case MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS:
                return mutation.updates.length > MUTATIONS_MAX_BATCH_SIZE;
            default:
                return false;
        }
    }

    /** @internal */
    _assertFieldIsValidForMutation(field: Field) {
        if (field.isComputed) {
            throw spawnError(
                "Can't set cell values: Field '%s' is computed and cannot be set",
                field.name,
            );
        }
    }

    /** @internal */
    _assertMutationIsValid(mutation: Mutation) {

        const appInterface = this._sdk.__appInterface;
        const billingPlanGrouping = this._base.__billingPlanGrouping;

        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES: {
                const {tableId, records} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't set cell values: No table with id %s exists", tableId);
                }

                const recordStore = this._base.__getRecordStore(tableId);

                const checkedFieldIds = new Set();

                for (const record of records) {
                    let existingRecord = null;
                    if (recordStore.isRecordMetadataLoaded) {
                        existingRecord = recordStore.getRecordByIdIfExists(record.id);
                        if (!existingRecord) {
                            throw spawnError(
                                "Can't set cell values: No record with id %s exists",
                                record.id,
                            );
                        }
                    }

                    for (const fieldId of Object.keys(record.cellValuesByFieldId)) {
                        const field = table.getFieldByIdIfExists(fieldId);
                        if (!field) {
                            throw spawnError(
                                "Can't set cell values: No field with id %s exists in table '%s'",
                                fieldId,
                                table.name,
                            );
                        }

                        if (!checkedFieldIds.has(fieldId)) {
                            this._assertFieldIsValidForMutation(field);
                            checkedFieldIds.add(fieldId);
                        }

                        if (existingRecord && recordStore.areCellValuesLoadedForFieldId(fieldId)) {
                            const validationResult = this._airtableInterface.fieldTypeProvider.validateCellValueForUpdate(
                                appInterface,
                                record.cellValuesByFieldId[fieldId],
                                existingRecord._getRawCellValue(field),
                                field._data,
                            );
                            if (!validationResult.isValid) {
                                throw spawnError(
                                    "Can't set cell values: invalid cell value for field '%s'.\n%s",
                                    field.name,
                                    validationResult.reason,
                                );
                            }
                        }
                    }
                }
                return;
            }

            case MutationTypes.DELETE_MULTIPLE_RECORDS: {
                const {tableId, recordIds} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't delete records: No table with id %s exists", tableId);
                }

                const recordStore = this._base.__getRecordStore(tableId);
                if (recordStore.isRecordMetadataLoaded) {
                    for (const recordId of recordIds) {
                        const record = recordStore.getRecordByIdIfExists(recordId);
                        if (!record) {
                            throw spawnError(
                                "Can't delete records: No record with id %s exists in table '%s'",
                                recordId,
                                table.name,
                            );
                        }
                    }
                }
                return;
            }

            case MutationTypes.CREATE_MULTIPLE_RECORDS: {
                const {tableId, records} = mutation;
                const checkedFieldIds = new Set();

                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't create records: No table with id %s exists", tableId);
                }

                for (const record of records) {
                    for (const fieldId of Object.keys(record.cellValuesByFieldId)) {
                        const field = table.getFieldByIdIfExists(fieldId);
                        if (!field) {
                            throw spawnError(
                                "Can't create records: No field with id %s exists in table '%s'",
                                fieldId,
                                table.name,
                            );
                        }

                        if (!checkedFieldIds.has(fieldId)) {
                            this._assertFieldIsValidForMutation(field);
                            checkedFieldIds.add(fieldId);
                        }

                        const validationResult = this._airtableInterface.fieldTypeProvider.validateCellValueForUpdate(
                            appInterface,
                            record.cellValuesByFieldId[fieldId],
                            null,
                            field._data,
                        );
                        if (!validationResult.isValid) {
                            throw spawnError(
                                "Can't create records: invalid cell value for field '%s'.\n%s",
                                field.name,
                                validationResult.reason,
                            );
                        }
                    }
                }
                return;
            }

            case MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS: {
                return;
            }

            case MutationTypes.CREATE_SINGLE_FIELD: {
                const {tableId, name, config} = mutation;
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

                if (!name) {
                    throw spawnError("Can't create field: must provide non-empty name");
                }

                if (name.length > MAX_FIELD_NAME_LENGTH) {
                    throw spawnError(
                        "Can't create field: name '%s' exceeds maximum length of %s characters",
                        name,
                        MAX_FIELD_NAME_LENGTH,
                    );
                }

                const existingLowercaseFieldNames = table.fields.map(field =>
                    field.name.toLowerCase(),
                );

                if (existingLowercaseFieldNames.includes(name.toLowerCase())) {
                    throw spawnError(
                        "Can't create field: field with name '%s' already exists",
                        name,
                    );
                }

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
    _applyOptimisticUpdatesForMutation(mutation: Mutation): boolean {
        if (mutation.type === MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS) {
            this._applyGlobalConfigUpdates(mutation.updates);
            return true;
        }

        const modelChanges = this._getOptimisticModelChangesForMutation(mutation);

        if (modelChanges.length > 0) {
            this._applyModelChanges(modelChanges);
            return true;
        }

        return false;
    }

    /** @internal */
    _getOptimisticModelChangesForMutation(mutation: Mutation): Array<ModelChange> {
        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES: {
                const {tableId, records} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);

                return records.flatMap(record =>
                    Object.keys(record.cellValuesByFieldId)
                        .filter(fieldId => recordStore.areCellValuesLoadedForFieldId(fieldId))
                        .map(fieldId => ({
                            path: [
                                'tablesById',
                                tableId,
                                'recordsById',
                                record.id,
                                'cellValuesByFieldId',
                                fieldId,
                            ],
                            value: record.cellValuesByFieldId[fieldId],
                        })),
                );
            }

            case MutationTypes.DELETE_MULTIPLE_RECORDS: {
                const {tableId, recordIds} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);

                if (!recordStore.isRecordMetadataLoaded) {
                    return [];
                }

                return [
                    ...recordIds.map(recordId => ({
                        path: ['tablesById', tableId, 'recordsById', recordId],
                        value: undefined,
                    })),
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

            case MutationTypes.CREATE_MULTIPLE_RECORDS: {
                const {tableId, records} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);

                if (!recordStore.isRecordMetadataLoaded) {
                    return [];
                }

                return [
                    ...records.map(record => {
                        const filteredCellValuesByFieldId: ObjectMap<FieldId, unknown> = {};
                        for (const [fieldId, cellValue] of entries(record.cellValuesByFieldId)) {
                            if (recordStore.areCellValuesLoadedForFieldId(fieldId)) {
                                filteredCellValuesByFieldId[fieldId] = cellValue;
                            }
                        }
                        return {
                            path: ['tablesById', tableId, 'recordsById', record.id],
                            value: {
                                id: record.id,
                                cellValuesByFieldId: filteredCellValuesByFieldId,
                                commentCount: 0,
                                createdTime: new Date().toJSON(),
                            },
                        };
                    }),
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

            case MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS: {
                throw spawnError(
                    'attempting to generate model updates for SET_MULTIPLE_GLOBAL_CONFIG_PATH',
                );
            }

            case MutationTypes.CREATE_SINGLE_FIELD:
            case MutationTypes.UPDATE_SINGLE_FIELD_CONFIG:
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
