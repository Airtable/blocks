// @flow
import {FieldTypes} from '../types/field';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import type Field from './field';

const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);
const {PublicApiVersions} = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/api_versions',
);

export type CellValueValidationResult = {|isValid: true|} | {|isValid: false, reason: string|};

const publicCellValueUtils = {
    parsePublicApiCellValue(publicCellValue: mixed, field: Field): mixed {
        return columnTypeProvider.parsePublicApiCellValue(
            publicCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            getSdk().__appInterface,
            PublicApiVersions.API2,
        );
    },
    validatePublicCellValueForUpdate(
        newPublicCellValue: mixed,
        currentPublicCellValue: mixed,
        field: Field,
    ): CellValueValidationResult {
        if (columnTypeProvider.isComputed(field.__getRawType())) {
            return {isValid: false, reason: `${field.type} fields cannot be updated`};
        }

        const currentPrivateCellValue = this.parsePublicApiCellValue(currentPublicCellValue, field);
        const validationResult = columnTypeProvider.validatePublicApiCellValueForUpdate(
            newPublicCellValue,
            currentPrivateCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            getSdk().__appInterface,
            PublicApiVersions.API2,
        );
        if (!validationResult.isValid) {
            return {isValid: false, reason: `Invalid cell value: ${validationResult.reason}`};
        }

        if (field.type === FieldTypes.MULTIPLE_RECORD_LINKS) {
            const linkedRecordValidationResult = this._validateLinkedRecordCellValueForUpdate(
                newPublicCellValue,
                field,
            );
            if (!linkedRecordValidationResult.isValid) {
                return linkedRecordValidationResult;
            }
        }

        return {isValid: true};
    },
    normalizePublicCellValueForUpdate(publicCellValue: mixed, field: Field): mixed {
        if (field.type === FieldTypes.MULTIPLE_RECORD_LINKS) {
            return this._normalizeLinkedRecordCellValueForUpdate(publicCellValue, field);
        }
        return publicCellValue;
    },
    _validateLinkedRecordCellValueForUpdate(
        newPublicCellValue: mixed,
        field: Field,
    ): CellValueValidationResult {

        if (newPublicCellValue === null || newPublicCellValue === undefined) {
            return {isValid: true};
        }

        invariant(field.options, 'Invalid field type');
        const tableId = field.options.linkedTableId;
        invariant(typeof tableId === 'string', 'linkedTableId must be string');
        const table = getSdk().base.getTableByIdIfExists(tableId);
        if (!table) {
            return {isValid: false, reason: 'Linked table does not exist'};
        }
        const recordStore = getSdk().base.__getRecordStore(tableId);
        if (!recordStore.isDataLoaded) {
            return {
                isValid: false,
                reason: 'Cannot set a record link cell value if linked table is not loaded',
            };
        }
        invariant(
            Array.isArray(newPublicCellValue),
            'Linked record cell value must be an array of objects',
        );
        for (const foreignRecordObj of newPublicCellValue) {
            invariant(
                foreignRecordObj && typeof foreignRecordObj === 'object',
                'Linked record cell value must be an array of objects',
            );

            const foreignRecordId = foreignRecordObj.id;
            invariant(typeof foreignRecordId === 'string', 'Linked record id must be a string');

            const foreignRecord = recordStore.getRecordByIdIfExists(foreignRecordId);
            if (!foreignRecord) {
                return {
                    isValid: false,
                    reason: `Invalid cell value: Linked record does not exist with id: ${foreignRecordId}`,
                };
            }
        }
        return {isValid: true};
    },
    _normalizeLinkedRecordCellValueForUpdate(newPublicCellValue: mixed, field: Field): mixed {
        if (newPublicCellValue === null || newPublicCellValue === undefined) {
            return newPublicCellValue;
        }

        invariant(field.options, 'Invalid field type');
        const tableId = field.options.linkedTableId;
        invariant(typeof tableId === 'string', 'no linkedTableId');
        const recordStore = getSdk().base.__getRecordStore(tableId);
        invariant(
            Array.isArray(newPublicCellValue),
            'Linked record cell value must be an array of objects',
        );
        return newPublicCellValue.map(foreignRecordObj => {
            invariant(
                foreignRecordObj && typeof foreignRecordObj === 'object',
                'Linked record cell value must be an array of objects',
            );

            const foreignRecordId = foreignRecordObj.id;
            invariant(typeof foreignRecordId === 'string', 'Linked record id must be a string');

            const foreignRecord = recordStore.getRecordByIdIfExists(foreignRecordId);
            invariant(foreignRecord, 'Record does not exist in linked table');

            return {...foreignRecordObj, name: foreignRecord.primaryCellValueAsString};
        });
    },
};

export default publicCellValueUtils;
