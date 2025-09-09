import {type SdkMode} from '../../sdk_mode';
import {type ModelChange} from '../types/base_core';
import {type GlobalConfigUpdate} from '../types/global_config';
import {
    type PermissionCheckResult,
    MutationTypesCore,
    type SetMultipleGlobalConfigPathsMutation,
} from '../types/mutations_core';
import {spawnError} from '../error_utils';
import {type AirtableInterfaceCore} from '../types/airtable_interface_core';
import {entries, type ObjectMap} from '../private_utils';
import {type FieldId} from '../types/hyper_ids';

export const MUTATIONS_MAX_BATCH_SIZE = 50;

const MUTATIONS_MAX_BODY_SIZE = 1.9 * 1024 * 1024;

const MUTATION_HOLD_FOR_MS = 100;

/** @hidden */
export abstract class MutationsCore<SdkModeT extends SdkMode> {
    /** @internal */
    _airtableInterface: SdkModeT['AirtableInterfaceT'];
    /** @internal */
    _session: SdkModeT['SessionT'];
    /** @internal */
    _sdk: SdkModeT['SdkT'];
    /** @internal */
    _base: SdkModeT['BaseT'];
    /** @internal */
    _applyModelChanges: (arg1: Array<ModelChange>) => void;
    /** @internal */
    _applyGlobalConfigUpdates: (arg1: ReadonlyArray<GlobalConfigUpdate>) => void;

    /** @hidden */
    constructor(
        sdk: SdkModeT['SdkT'],
        session: SdkModeT['SessionT'],
        base: SdkModeT['BaseT'],
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
    async applyMutationAsync(mutation: SdkModeT['MutationT']): Promise<void> {
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
            await this._getAirtableInterfaceAsAirtableInterfaceCore().applyMutationAsync(mutation, {
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
    checkPermissionsForMutation(mutation: SdkModeT['PartialMutationT']): PermissionCheckResult {
        return this._getAirtableInterfaceAsAirtableInterfaceCore().checkPermissionsForMutation(
            mutation,
            this._base.__getBaseData(),
        );
    }

    /** @hidden */
    private _getAirtableInterfaceAsAirtableInterfaceCore(): AirtableInterfaceCore<SdkModeT> {
        return this._airtableInterface as AirtableInterfaceCore<SdkModeT>;
    }

    /** @internal */
    _assertMutationUnderLimits(mutation: SdkModeT['MutationT']) {
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
    _applyOptimisticUpdatesForMutation(mutation: SdkModeT['MutationT']): boolean {
        if (mutation.type === MutationTypesCore.SET_MULTIPLE_GLOBAL_CONFIG_PATHS) {
            const _mutation = mutation as SetMultipleGlobalConfigPathsMutation;
            this._applyGlobalConfigUpdates(_mutation.updates);
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
    protected _doesMutationExceedBatchSizeLimit(mutation: SdkModeT['MutationT']): boolean {
        switch (mutation.type) {
            case MutationTypesCore.SET_MULTIPLE_RECORDS_CELL_VALUES:
            case MutationTypesCore.CREATE_MULTIPLE_RECORDS:
                return mutation.records.length > MUTATIONS_MAX_BATCH_SIZE;
            case MutationTypesCore.DELETE_MULTIPLE_RECORDS:
                return mutation.recordIds.length > MUTATIONS_MAX_BATCH_SIZE;
            case MutationTypesCore.SET_MULTIPLE_GLOBAL_CONFIG_PATHS:
                return mutation.updates.length > MUTATIONS_MAX_BATCH_SIZE;
            default:
                return false;
        }
    }

    /** @internal */
    _assertFieldIsValidForMutation(field: SdkModeT['FieldT']): void {
        if (field.isComputed) {
            throw spawnError(
                "Can't set cell values: Field '%s' is computed and cannot be set",
                field.name,
            );
        }
    }

    /** @internal */
    _assertMutationIsValid(mutation: SdkModeT['MutationT']): void {

        const appInterface = this._sdk.__appInterface;

        switch (mutation.type) {
            case MutationTypesCore.SET_MULTIPLE_RECORDS_CELL_VALUES: {
                const {tableId, records} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't set cell values: No table with id %s exists", tableId);
                }

                const recordStore = this._base.__getRecordStore(tableId);

                const checkedFieldIds = new Set();

                for (const record of records) {
                    let existingRecord = null;
                    if (this._isRecordStoreReadyForMutations(recordStore)) {
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

                        if (
                            existingRecord &&
                            this._isFieldAvailableForMutation(recordStore, field.id)
                        ) {
                            const validationResult =
                                this._airtableInterface.fieldTypeProvider.validateCellValueForUpdate(
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

            case MutationTypesCore.DELETE_MULTIPLE_RECORDS: {
                const {tableId, recordIds} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError("Can't delete records: No table with id %s exists", tableId);
                }

                const recordStore = this._base.__getRecordStore(tableId);
                if (this._isRecordStoreReadyForMutations(recordStore)) {
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

            case MutationTypesCore.CREATE_MULTIPLE_RECORDS: {
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

                        const validationResult =
                            this._airtableInterface.fieldTypeProvider.validateCellValueForUpdate(
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

            case MutationTypesCore.SET_MULTIPLE_GLOBAL_CONFIG_PATHS: {
                return;
            }
            default:
                throw spawnError('unhandled mutation type: %s', mutation.type);
        }
    }

    /** @internal */
    protected _getOptimisticModelChangesForMutation(
        mutation: SdkModeT['MutationT'],
    ): Array<ModelChange> {
        switch (mutation.type) {
            case MutationTypesCore.SET_MULTIPLE_RECORDS_CELL_VALUES: {
                const {tableId, records} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);

                return records.flatMap((record) =>
                    Object.keys(record.cellValuesByFieldId)
                        .filter((fieldId) =>
                            this._isFieldAvailableForMutation(recordStore, fieldId),
                        )
                        .map((fieldId) => ({
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

            case MutationTypesCore.DELETE_MULTIPLE_RECORDS: {
                const {tableId, recordIds} = mutation;
                return recordIds.map((recordId) => ({
                    path: ['tablesById', tableId, 'recordsById', recordId],
                    value: undefined,
                }));
            }

            case MutationTypesCore.CREATE_MULTIPLE_RECORDS: {
                const {tableId, records} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);

                return records.map((record) => {
                    const filteredCellValuesByFieldId: ObjectMap<FieldId, unknown> = {};
                    for (const [fieldId, cellValue] of entries(record.cellValuesByFieldId)) {
                        if (this._isFieldAvailableForMutation(recordStore, fieldId)) {
                            filteredCellValuesByFieldId[fieldId] = cellValue;
                        }
                    }

                    return {
                        path: ['tablesById', tableId, 'recordsById', record.id],
                        value: {
                            ...this._getDefaultRecordProperties(),
                            id: record.id,
                            cellValuesByFieldId: filteredCellValuesByFieldId,
                        },
                    };
                });
            }

            case MutationTypesCore.SET_MULTIPLE_GLOBAL_CONFIG_PATHS: {
                throw spawnError(
                    'attempting to generate model updates for SET_MULTIPLE_GLOBAL_CONFIG_PATH',
                );
            }

            default:
                throw spawnError('unhandled mutation type: %s', mutation.type);
        }
    }

    /** @internal */
    abstract _isRecordStoreReadyForMutations(recordStore: SdkModeT['RecordStoreT']): boolean;
    /** @internal */
    abstract _isFieldAvailableForMutation(
        recordStore: SdkModeT['RecordStoreT'],
        fieldId: FieldId,
    ): boolean;
    /** @internal */
    abstract _getDefaultRecordProperties(): Partial<SdkModeT['RecordDataT']>;
}
