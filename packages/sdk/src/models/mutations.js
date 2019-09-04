// @flow
import {type AirtableInterface} from '../injected/airtable_interface';
import {PermissionLevels} from '../types/permission_levels';
import {type ModelChange} from '../types/base';
import {type Mutation, MutationTypes} from '../types/mutations';
import {FieldTypes} from '../types/field';
import {entries} from '../private_utils';
import {spawnError, spawnUnknownSwitchCaseError} from '../error_utils';
import {type GlobalConfigUpdate} from '../global_config';
import cellValueUtils from './cell_value_utils';
import type Session from './session';
import type Base from './base';
import type Field from './field';

const permissionHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/permissions/permission_helpers',
);

// Limit for how many items can be updated from a single batch mutation.
// This is number of records for MULTIPLE_RECORDS type mutations, and number of global config paths
// for SET_MULTIPLE_GLOBAL_CONFIG_PATHS.
// Same limit is enforced liveapp-side
const MUTATIONS_MAX_BATCH_SIZE = 50;

// Liveapp requests must be under 2mb in size: we enforce a 1.9mb limit here to allow space for
// the other parts of the request
const MUTATIONS_MAX_BODY_SIZE = 1.9 * 1024 * 1024;

const MUTATION_HOLD_FOR_MS = 100;

const FIELD_TYPE_MUTATION_BAN_SET = new Set([
    FieldTypes.MULTIPLE_ATTACHMENTS,
    FieldTypes.MULTIPLE_RECORD_LINKS,
]);

/** @private */
class Mutations {
    _airtableInterface: AirtableInterface;
    _session: Session;
    _base: Base;
    _applyModelChanges: (Array<ModelChange>) => void;
    _applyGlobalConfigUpdates: (Array<GlobalConfigUpdate>) => void;

    constructor(
        airtableInterface: AirtableInterface,
        session: Session,
        base: Base,
        applyModelChanges: (Array<ModelChange>) => void,
        applyGlobalConfigUpdates: (Array<GlobalConfigUpdate>) => void,
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

        if (!this.doesCurrentUserHavePermissionToApplyMutation(mutation)) {
            throw spawnError(
                "The current user doesn't have permission to apply a %s mutation",
                mutation.type,
            );
        }

        const didApplyOptimisticUpdates = this._applyOptimisticUpdatesForMutation(mutation);

        try {
            await this._airtableInterface.applyMutationAsync(mutation, {
                holdForMs: MUTATION_HOLD_FOR_MS,
            });
        } catch (err) {
            if (didApplyOptimisticUpdates) {
                // if we applied optimistic updates, we can't gracefully handle a promise rejection
                // here - we can't un-apply optimistic updates, so the SDK's internal data model is
                // in an unexpected state. Instead of letting this promise get rejected, throw an
                // error after an async gap to crash the block, and make this promise await
                // something that will never resolve so we don't run any of the developers error-
                // handling code.
                setTimeout(() => {
                    throw err;
                }, 0);
                await new Promise(() => {});
            } else {
                throw err;
            }
        }
    }

    doesCurrentUserHavePermissionToApplyMutation(mutation: Mutation): boolean {
        // TODO: add permission checks to AirtableInterface and move this there - also accounting for field/table locking
        return permissionHelpers.can(this._session.__rawPermissionLevel, PermissionLevels.EDIT);
    }

    _assertMutationUnderLimits(mutation: Mutation) {
        // Two limits to check here:
        // - for record-related mutations, it isn't above MUTATIONS_MAX_BATCH_SIZE
        // - mutation payload size won't exceed liveapp request payload size limit
        // Requests are sent as form-encoded utf-8 (1 byte characters)
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

        if (FIELD_TYPE_MUTATION_BAN_SET.has(field.type)) {
            throw spawnError('Fields of type %s cannot currently be mutated', field.type);
        }
    }

    _assertMutationIsValid(mutation: Mutation) {
        // We call validate the data (including any cell values) because if the data required for
        // us to do that is already loaded in the block, we can error out before applying
        // optimistic updates or sending the update to liveapp. That means that the error is
        // recoverable. Once we apply optimistic updates, if liveapp rejects the update then we
        // can't recover from that - we have to crash the block. We _could_ skip over these
        // validations - it wouldn't cause issues outside of the block frame. But running them
        // gives us slightly more confidence that we can do something other than completely crash
        // the block in the event of an invalid mutation.

        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES: {
                const {tableId, records} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError('No table with id %s exists', tableId);
                }

                // For every mutation, we check that we're not trying to set fields that we don't support
                // mutations for yet. When record data is loaded, we also check that the record we're
                // updating actually exists and that the cell values are valid.
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

                        // Current cell value is null since the record doesn't exist.
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
                // globalConfig update is a special case: globalConfig handles validation before
                // invoking this mutation, since it relies on internal state to validate the
                // paths being set.
                return;
            }

            default:
                throw spawnUnknownSwitchCaseError('mutation type', (mutation.type: empty));
        }
    }

    _applyOptimisticUpdatesForMutation(mutation: Mutation): boolean {
        // GlobalConfig updates are different to other mutations (on models): for models, we
        // only apply optimistic updates if the relevant models are loaded, whereas for
        // SET_MULTIPLE_GLOBAL_CONFIG_PATHS we always apply optimistic updates.
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
                        // Only apply optimistic changes for fields that are loaded
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
