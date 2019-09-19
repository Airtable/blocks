// @flow
import {type AirtableInterface} from '../injected/airtable_interface';
import {type ModelChange} from '../types/base';
import {
    type Mutation,
    type PartialMutation,
    type PermissionCheckResult,
    MutationTypes,
} from '../types/mutations';
import {entries} from '../private_utils';
import {spawnError, spawnUnknownSwitchCaseError} from '../error_utils';
import {type GlobalConfigUpdate} from '../global_config';
import cellValueUtils from './cell_value_utils';
import type Session from './session';
import type Base from './base';
import type Field from './field';

const MUTATIONS_MAX_BATCH_SIZE = 50;

const MUTATIONS_MAX_BODY_SIZE = 1.9 * 1024 * 1024;

const MUTATION_HOLD_FOR_MS = 100;

/** @private */
class Mutations {
    _airtableInterface: AirtableInterface;
    _session: Session;
    _base: Base;
    _applyModelChanges: (Array<ModelChange>) => void;
    _applyGlobalConfigUpdates: ($ReadOnlyArray<GlobalConfigUpdate>) => void;

    constructor(
        airtableInterface: AirtableInterface,
        session: Session,
        base: Base,
        applyModelChanges: ($ReadOnlyArray<ModelChange>) => void,
        applyGlobalConfigUpdates: ($ReadOnlyArray<GlobalConfigUpdate>) => void,
    ) {
        this._airtableInterface = airtableInterface;
        this._session = session;
        this._base = base;
        this._applyModelChanges = applyModelChanges;
        this._applyGlobalConfigUpdates = applyGlobalConfigUpdates;
    }

    async applyMutationAsync(mutation: Mutation): Promise<void> {
        this._assertMutationUnderLimits(mutation);
        this._assertMutationIsValid(mutation);

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

    checkPermissionsForMutation(mutation: PartialMutation): PermissionCheckResult {
        return this._airtableInterface.checkPermissionsForMutation(
            mutation,
            this._base.__getBaseData(),
        );
    }

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

    _assertFieldIsValidForMutation(field: Field, tableId: string) {
        if (field.isComputed) {
            throw spawnError('Field %s is computed and cannot be set', field.id);
        }
    }

    _assertMutationIsValid(mutation: Mutation) {

        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES: {
                const {tableId, records} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError('No table with id %s exists', tableId);
                }

                const recordStore = this._base.__getRecordStore(tableId);

                const checkedFieldIds = new Set();

                for (const record of records) {
                    let existingRecord = null;
                    if (recordStore.isRecordMetadataLoaded) {
                        existingRecord = recordStore.getRecordByIdIfExists(record.id);
                        if (!existingRecord) {
                            throw spawnError('No record with id %s exists', record.id);
                        }
                    }

                    for (const fieldId of Object.keys(record.cellValuesByFieldId)) {
                        const field = table.getFieldByIdIfExists(fieldId);
                        if (!field) {
                            throw spawnError(
                                'No field with id %s exists in table %s',
                                fieldId,
                                tableId,
                            );
                        }

                        if (!checkedFieldIds.has(fieldId)) {
                            this._assertFieldIsValidForMutation(field, tableId);
                            checkedFieldIds.add(fieldId);
                        }

                        if (existingRecord && recordStore.areCellValuesLoadedForFieldId(fieldId)) {
                            const oldCellValue = existingRecord.getCellValue(fieldId);
                            const validationResult = cellValueUtils.validatePublicCellValueForUpdate(
                                record.cellValuesByFieldId[fieldId],
                                oldCellValue,
                                field,
                            );
                            if (!validationResult.isValid) {
                                throw spawnError(validationResult.reason);
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
                    throw spawnError('No table with id %s exists', tableId);
                }

                const recordStore = this._base.__getRecordStore(tableId);
                if (recordStore.isRecordMetadataLoaded) {
                    for (const recordId of recordIds) {
                        const record = recordStore.getRecordByIdIfExists(recordId);
                        if (!record) {
                            throw spawnError(
                                'No record with id %s exists in table %s',
                                recordId,
                                tableId,
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
                    throw spawnError('No table with id %s exists', tableId);
                }

                for (const record of records) {
                    for (const fieldId of Object.keys(record.cellValuesByFieldId)) {
                        const field = table.getFieldByIdIfExists(fieldId);
                        if (!field) {
                            throw spawnError(
                                'No field with id %s exists in table %s',
                                fieldId,
                                tableId,
                            );
                        }

                        if (!checkedFieldIds.has(fieldId)) {
                            this._assertFieldIsValidForMutation(field, tableId);
                            checkedFieldIds.add(fieldId);
                        }

                        const validationResult = cellValueUtils.validatePublicCellValueForUpdate(
                            record.cellValuesByFieldId[fieldId],
                            null,
                            field,
                        );
                        if (!validationResult.isValid) {
                            throw spawnError(validationResult.reason);
                        }
                    }
                }
                return;
            }

            case MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS: {
                return;
            }

            default:
                throw spawnUnknownSwitchCaseError('mutation type', (mutation.type: empty));
        }
    }

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
                        const filteredCellValuesByFieldId = {};
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

            default:
                throw spawnUnknownSwitchCaseError('mutation type', (mutation.type: empty));
        }
    }
}

export default Mutations;
