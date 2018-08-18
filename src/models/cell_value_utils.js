// @flow
const columnTypeProvider = require('client_server_shared/column_types/column_type_provider');
const ApiDisplayFormats = require('client_server_shared/api_display_formats');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');
const getSdk = require('client/blocks/sdk/get_sdk');
const invariant = require('invariant');

import type Field from 'client/blocks/sdk/models/field';
import type {ValidationResult} from 'client_server_shared/object_schemas/validation_result';

const publicCellValueUtils = {
    getPublicCellValueFromPrivateCellValue(privateCellValue: mixed, field: Field): mixed {
        return columnTypeProvider.formatCellValueForPublicApi(
            privateCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            field.parentTable.parentBase.__appInterface,
            ApiDisplayFormats.API2,
        );
    },
    validatePublicCellValueForUpdate(newPublicCellValue: mixed, currentPrivateCellValue: mixed, field: Field): ValidationResult {
        if (columnTypeProvider.isComputed(field.__getRawType())) {
            return {isValid: false, reason: `${field.config.type} fields cannot be updated`};
        }

        const validationResult = columnTypeProvider.validatePublicApiCellValueForUpdate(
            newPublicCellValue,
            currentPrivateCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            field.parentTable.parentBase.__appInterface,
            ApiDisplayFormats.API2,
        );
        if (!validationResult.isValid) {
            return {isValid: false, reason: `Invalid cell value: ${validationResult.reason}`};
        }

        // Special case foreign records. This is a bit strange, but necessary for the following reasons:
        // 1) columnTypeProvider is completely unaware of whether it's being used from within the block sdk,
        //    and therefore doesn't have access to the foreign table model.
        // 2) We want to make validate foreign record objects before we hit liveapp, and especially before
        //    we hit the server. This way, we can validate the existence of foreign records within the block
        //    rather than allowing the block developer to crash liveapp by passing in a valid but non-existent
        //    record id.
        if (field.config.type === ApiFieldTypes.MULTIPLE_RECORD_LINKS) {
            const linkedRecordValidationResult = this._validateLinkedRecordCellValueForUpdate(newPublicCellValue, field);
            if (!linkedRecordValidationResult.isValid) {
                return linkedRecordValidationResult;
            }
        }

        return {isValid: true};
    },
    parsePublicCellValueForUpdate(newPublicCellValue: mixed, currentPrivateCellValue: mixed, field: Field): mixed {
        if (field.config.type === ApiFieldTypes.MULTIPLE_RECORD_LINKS) {
            newPublicCellValue = this._normalizeLinkedRecordCellValueForUpdate(newPublicCellValue, field);
        }
        return columnTypeProvider.parsePublicApiCellValueForUpdate(
            newPublicCellValue,
            currentPrivateCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            field.parentTable.parentBase.__appInterface,
            ApiDisplayFormats.API2,
        );
    },
    _validateLinkedRecordCellValueForUpdate(newPublicCellValue: mixed, field: Field): ValidationResult {
        // Special case foreign records to enforce that the foreign table is
        // loaded. This let's us validate recordIds against the foreign
        // table before hitting the server.

        if (newPublicCellValue === null || newPublicCellValue === undefined) {
            // Null and undefined are always valid.
            return {isValid: true};
        }

        invariant(field.config.options, 'Invalid field type');
        const tableId = field.config.options.linkedTableId;
        const table = getSdk().base.getTableById(tableId);
        if (!table) {
            return {isValid: false, reason: 'Linked table does not exist'};
        }
        if (!table.isDataLoaded) {
            return {isValid: false, reason: 'Cannot set a record link cell value if linked table is not loaded'};
        }
        invariant(Array.isArray(newPublicCellValue), 'Linked record cell value must be an array of objects');
        for (const foreignRecordObj of newPublicCellValue) {
            invariant(foreignRecordObj && typeof foreignRecordObj === 'object', 'Linked record cell value must be an array of objects');

            const foreignRecordId = foreignRecordObj.id;
            invariant(typeof foreignRecordId === 'string', 'Linked record id must be a string');

            const foreignRecord = table.getRecordById(foreignRecordId);
            if (!foreignRecord) {
                return {isValid: false, reason: `Invalid cell value: Linked record does not exist with id: ${foreignRecordId}`};
            }
        }
        return {isValid: true};
    },
    _normalizeLinkedRecordCellValueForUpdate(newPublicCellValue: mixed, field: Field): mixed {
        if (newPublicCellValue === null || newPublicCellValue === undefined) {
            // Null and undefined need no normalization.
            return newPublicCellValue;
        }

        invariant(field.config.options, 'Invalid field type');
        const tableId = field.config.options.linkedTableId;
        const table = getSdk().base.getTableById(tableId);
        invariant(table, 'Linked table does not exist');
        invariant(Array.isArray(newPublicCellValue), 'Linked record cell value must be an array of objects');
        for (const foreignRecordObj of newPublicCellValue) {
            invariant(foreignRecordObj && typeof foreignRecordObj === 'object', 'Linked record cell value must be an array of objects');

            const foreignRecordId = foreignRecordObj.id;
            invariant(typeof foreignRecordId === 'string', 'Linked record id must be a string');

            const foreignRecord = table.getRecordById(foreignRecordId);
            invariant(foreignRecord, 'Record does not exist in linked table');

            // Ignore whatever `name` we were given (if any) and overwrite it
            // with the record's primary cell value. The `name` is effectively
            // read-only (i.e. you can't update a record primary cell value through
            // it's record link obj). We could assert that the name doesn't change,
            // but the strictness is annoying (e.g. if you generate an updated cell value,
            // then the record's primary cell value changes before you run it, it's better
            // for it to succeed than to throw an error).
            foreignRecordObj.name = foreignRecord.primaryCellValueAsString;
        }
        return newPublicCellValue;
    },
};

module.exports = publicCellValueUtils;
