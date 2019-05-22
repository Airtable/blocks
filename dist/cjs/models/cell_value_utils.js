"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _invariant = _interopRequireDefault(require("invariant"));

var _field = require("../types/field");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

const columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

const {
  PublicApiVersions
} = window.__requirePrivateModuleFromAirtable('client_server_shared/api_versions');

const publicCellValueUtils = {
  parsePublicApiCellValue(publicCellValue, field) {
    return columnTypeProvider.parsePublicApiCellValue(publicCellValue, field.__getRawType(), field.__getRawTypeOptions(), field.parentTable.parentBase.__appInterface, PublicApiVersions.API2);
  },

  validatePublicCellValueForUpdate(newPublicCellValue, currentPublicCellValue, field) {
    if (columnTypeProvider.isComputed(field.__getRawType())) {
      return {
        isValid: false,
        reason: `${field.config.type} fields cannot be updated`
      };
    }

    const currentPrivateCellValue = this.parsePublicApiCellValue(currentPublicCellValue, field);
    const validationResult = columnTypeProvider.validatePublicApiCellValueForUpdate(newPublicCellValue, currentPrivateCellValue, field.__getRawType(), field.__getRawTypeOptions(), field.parentTable.parentBase.__appInterface, PublicApiVersions.API2);

    if (!validationResult.isValid) {
      return {
        isValid: false,
        reason: `Invalid cell value: ${validationResult.reason}`
      };
    } // Special case foreign records. This is a bit strange, but necessary for the following reasons:
    // 1) columnTypeProvider is completely unaware of whether it's being used from within the block sdk,
    //    and therefore doesn't have access to the foreign table model.
    // 2) We want to make validate foreign record objects before we hit liveapp, and especially before
    //    we hit the server. This way, we can validate the existence of foreign records within the block
    //    rather than allowing the block developer to crash liveapp by passing in a valid but non-existent
    //    record id.


    if (field.config.type === _field.FieldTypes.MULTIPLE_RECORD_LINKS) {
      const linkedRecordValidationResult = this._validateLinkedRecordCellValueForUpdate(newPublicCellValue, field);

      if (!linkedRecordValidationResult.isValid) {
        return linkedRecordValidationResult;
      }
    }

    return {
      isValid: true
    };
  },

  normalizePublicCellValueForUpdate(publicCellValue, field) {
    if (field.config.type === _field.FieldTypes.MULTIPLE_RECORD_LINKS) {
      return this._normalizeLinkedRecordCellValueForUpdate(publicCellValue, field);
    }

    return publicCellValue;
  },

  _validateLinkedRecordCellValueForUpdate(newPublicCellValue, field) {
    // Special case foreign records to enforce that the foreign table is
    // loaded. This let's us validate recordIds against the foreign
    // table before hitting the server.
    if (newPublicCellValue === null || newPublicCellValue === undefined) {
      // Null and undefined are always valid.
      return {
        isValid: true
      };
    }

    (0, _invariant.default)(field.config.options, 'Invalid field type');
    const tableId = field.config.options.linkedTableId;
    const table = (0, _get_sdk.default)().base.getTableById(tableId);

    if (!table) {
      return {
        isValid: false,
        reason: 'Linked table does not exist'
      };
    }

    if (!table.isDataLoaded) {
      return {
        isValid: false,
        reason: 'Cannot set a record link cell value if linked table is not loaded'
      };
    }

    (0, _invariant.default)((0, _isArray.default)(newPublicCellValue), 'Linked record cell value must be an array of objects');

    for (const foreignRecordObj of newPublicCellValue) {
      (0, _invariant.default)(foreignRecordObj && typeof foreignRecordObj === 'object', 'Linked record cell value must be an array of objects');
      const foreignRecordId = foreignRecordObj.id;
      (0, _invariant.default)(typeof foreignRecordId === 'string', 'Linked record id must be a string');
      const foreignRecord = table.getRecordById(foreignRecordId);

      if (!foreignRecord) {
        return {
          isValid: false,
          reason: `Invalid cell value: Linked record does not exist with id: ${foreignRecordId}`
        };
      }
    }

    return {
      isValid: true
    };
  },

  _normalizeLinkedRecordCellValueForUpdate(newPublicCellValue, field) {
    if (newPublicCellValue === null || newPublicCellValue === undefined) {
      // Null and undefined need no normalization.
      return newPublicCellValue;
    }

    (0, _invariant.default)(field.config.options, 'Invalid field type');
    const tableId = field.config.options.linkedTableId;
    const table = (0, _get_sdk.default)().base.getTableById(tableId);
    (0, _invariant.default)(table, 'Linked table does not exist');
    (0, _invariant.default)((0, _isArray.default)(newPublicCellValue), 'Linked record cell value must be an array of objects');
    return (0, _map.default)(newPublicCellValue).call(newPublicCellValue, foreignRecordObj => {
      (0, _invariant.default)(foreignRecordObj && typeof foreignRecordObj === 'object', 'Linked record cell value must be an array of objects');
      const foreignRecordId = foreignRecordObj.id;
      (0, _invariant.default)(typeof foreignRecordId === 'string', 'Linked record id must be a string');
      const foreignRecord = table.getRecordById(foreignRecordId);
      (0, _invariant.default)(foreignRecord, 'Record does not exist in linked table'); // Ignore whatever `name` we were given (if any) and overwrite it
      // with the record's primary cell value. The `name` is effectively
      // read-only (i.e. you can't update a record primary cell value through
      // it's record link obj). We could assert that the name doesn't change,
      // but the strictness is annoying (e.g. if you generate an updated cell value,
      // then the record's primary cell value changes before you run it, it's better
      // for it to succeed than to throw an error).

      return { ...foreignRecordObj,
        name: foreignRecord.primaryCellValueAsString
      };
    });
  }

};
var _default = publicCellValueUtils;
exports.default = _default;