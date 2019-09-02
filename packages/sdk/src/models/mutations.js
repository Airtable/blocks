// @flow
import {type AirtableInterface} from '../injected/airtable_interface';
import {PermissionLevels} from '../types/permission_levels';
import {type ModelChange} from '../types/base';
import {type Mutation, MutationTypes} from '../types/mutations';
import {FieldTypes} from '../types/field';
import {entries} from '../private_utils';
import {spawnError, spawnUnknownSwitchCaseError} from '../error_utils';
import cellValueUtils from './cell_value_utils';
import type Session from './session';
import type Base from './base';

const permissionHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/permissions/permission_helpers',
);

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

    constructor(
        airtableInterface: AirtableInterface,
        session: Session,
        base: Base,
        applyModelChanges: (Array<ModelChange>) => void,
    ) {
        this._airtableInterface = airtableInterface;
        this._session = session;
        this._base = base;
        this._applyModelChanges = applyModelChanges;
    }

    async applyMutationAsync(mutation: Mutation): Promise<void> {
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
            case MutationTypes.SET_SINGLE_RECORD_CELL_VALUES: {
                const {tableId, recordId, cellValuesByFieldId} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError('No table with id %s exists', tableId);
                }

                // For every mutation, we check that we're not trying to set fields that we don't support
                // mutations for yet. When record data is loaded, we also check that the record we're
                // updating actually exists and that the cell values are valid.
                const recordStore = this._base.__getRecordStore(tableId);

                let record = null;
                if (recordStore.isRecordMetadataLoaded) {
                    record = recordStore.getRecordByIdIfExists(recordId);
                    if (!record) {
                        throw spawnError('No record with id %s exists', recordId);
                    }
                }

                for (const fieldId of Object.keys(cellValuesByFieldId)) {
                    const field = table.getFieldByIdIfExists(fieldId);
                    if (!field) {
                        throw spawnError(
                            'No field with id %s exists in table %s',
                            fieldId,
                            tableId,
                        );
                    }

                    if (field.isComputed) {
                        throw spawnError('Field %s is computed and cannot be set', field.id);
                    }

                    if (FIELD_TYPE_MUTATION_BAN_SET.has(field.type)) {
                        throw spawnError(
                            'Fields of type %s cannot currently be mutated',
                            field.type,
                        );
                    }

                    if (record && recordStore.areCellValuesLoadedForFieldId(fieldId)) {
                        const oldCellValue = record.getCellValue(fieldId);
                        const validationResult = cellValueUtils.validatePublicCellValueForUpdate(
                            cellValuesByFieldId[fieldId],
                            oldCellValue,
                            field,
                        );
                        if (!validationResult.isValid) {
                            throw spawnError(validationResult.reason);
                        }
                    }
                }
                return;
            }

            case MutationTypes.DELETE_SINGLE_RECORD: {
                const {recordId, tableId} = mutation;
                const table = this._base.getTableByIdIfExists(tableId);
                if (!table) {
                    throw spawnError('No table with id %s exists', tableId);
                }

                const recordStore = this._base.__getRecordStore(tableId);
                if (recordStore.isRecordMetadataLoaded) {
                    const record = recordStore.getRecordByIdIfExists(recordId);
                    if (!record) {
                        throw spawnError(
                            'No record with id %s exists in table %s',
                            recordId,
                            tableId,
                        );
                    }
                }
                return;
            }

            case MutationTypes.CREATE_SINGLE_RECORD: {
                const {tableId, cellValuesByFieldId} = mutation;

                for (const fieldId of Object.keys(cellValuesByFieldId)) {
                    const field = this._base.getTableById(tableId).getFieldById(fieldId);

                    if (!field) {
                        throw spawnError(
                            'No field with id %s exists in table %s',
                            fieldId,
                            tableId,
                        );
                    }

                    if (field.isComputed) {
                        throw spawnError('Field %s is computed and cannot be set', field.id);
                    }

                    // Check that we're not trying to set fields that we don't support mutations for yet
                    if (FIELD_TYPE_MUTATION_BAN_SET.has(field.type)) {
                        throw spawnError(
                            'Fields of type %s cannot currently be set via mutations',
                            field.type,
                        );
                    }

                    // Current cell value is null since the record doesn't exist.
                    const validationResult = cellValueUtils.validatePublicCellValueForUpdate(
                        cellValuesByFieldId[fieldId],
                        null,
                        field,
                    );
                    if (!validationResult.isValid) {
                        throw spawnError(validationResult.reason);
                    }
                }
                return;
            }

            default:
                throw spawnUnknownSwitchCaseError('mutation type', (mutation.type: empty));
        }
    }

    _applyOptimisticUpdatesForMutation(mutation: Mutation): boolean {
        const modelChanges = this._getOptimisticModelChangesForMutation(mutation);

        if (modelChanges.length > 0) {
            this._applyModelChanges(modelChanges);
            return true;
        }

        return false;
    }

    _getOptimisticModelChangesForMutation(mutation: Mutation): Array<ModelChange> {
        switch (mutation.type) {
            case MutationTypes.SET_SINGLE_RECORD_CELL_VALUES: {
                const {tableId, recordId, cellValuesByFieldId} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);
                return Object.keys(cellValuesByFieldId)
                    .filter(fieldId => recordStore.areCellValuesLoadedForFieldId(fieldId))
                    .map(fieldId => ({
                        path: [
                            'tablesById',
                            tableId,
                            'recordsById',
                            recordId,
                            'cellValuesByFieldId',
                            fieldId,
                        ],
                        value: cellValuesByFieldId[fieldId],
                    }));
            }

            case MutationTypes.DELETE_SINGLE_RECORD: {
                const {tableId, recordId} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);

                if (!recordStore.isRecordMetadataLoaded) {
                    return [];
                }

                return [
                    {
                        path: ['tablesById', tableId, 'recordsById', recordId],
                        value: undefined,
                    },
                    ...this._base.getTableById(tableId).views.flatMap(view => {
                        const viewDataStore = recordStore.getViewDataStore(view.id);
                        if (!viewDataStore.isDataLoaded) {
                            return [];
                        }
                        return viewDataStore.__generateChangesForParentTableDeleteMultipleRecords([
                            recordId,
                        ]);
                    }),
                ];
            }

            case MutationTypes.CREATE_SINGLE_RECORD: {
                const {tableId, recordId, cellValuesByFieldId} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);

                if (!recordStore.isRecordMetadataLoaded) {
                    return [];
                }

                // Only apply optimistic changes for fields that are loaded
                const filteredCellValuesByFieldId = {};
                for (const [fieldId, cellValue] of entries(cellValuesByFieldId)) {
                    if (recordStore.areCellValuesLoadedForFieldId(fieldId)) {
                        filteredCellValuesByFieldId[fieldId] = cellValue;
                    }
                }

                return [
                    {
                        path: ['tablesById', tableId, 'recordsById', recordId],
                        value: {
                            id: recordId,
                            cellValuesByFieldId: filteredCellValuesByFieldId,
                            commentCount: 0,
                            createdTime: new Date().toJSON(),
                        },
                    },
                    ...this._base.getTableById(tableId).views.flatMap(view => {
                        const viewDataStore = recordStore.getViewDataStore(view.id);
                        if (!viewDataStore.isDataLoaded) {
                            return [];
                        }
                        return viewDataStore.__generateChangesForParentTableAddMultipleRecords([
                            recordId,
                        ]);
                    }),
                ];
            }

            default:
                throw spawnUnknownSwitchCaseError('mutation type', (mutation.type: empty));
        }
    }
}

export default Mutations;
