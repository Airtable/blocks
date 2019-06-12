"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldTypes = void 0;

/**
 * An enum of Airtable's field types
 * @alias fieldTypes
 * @example
 * import {fieldTypes} from '@airtable/blocks/models';
 * const numberFields = myTable.fields.filter(field => (
 *     field.type === fieldTypes.NUMBER
 * ));
 */
var FieldTypes = Object.freeze({
  /**
   * @alias fieldTypes.SINGLE_LINE_TEXT
   * @memberof fieldTypes
   */
  SINGLE_LINE_TEXT: 'singleLineText',

  /**
   * @alias fieldTypes.EMAIL
   * @memberof fieldTypes
   */
  EMAIL: 'email',

  /**
   * @alias fieldTypes.URL
   * @memberof fieldTypes
   */
  URL: 'url',

  /**
   * @alias fieldTypes.MULTILINE_TEXT
   * @memberof fieldTypes
   */
  MULTILINE_TEXT: 'multilineText',

  /**
   * @alias fieldTypes.NUMBER
   * @memberof fieldTypes
   */
  NUMBER: 'number',

  /**
   * @alias fieldTypes.PERCENT
   * @memberof fieldTypes
   */
  PERCENT: 'percent',

  /**
   * @alias fieldTypes.CURRENCY
   * @memberof fieldTypes
   */
  CURRENCY: 'currency',

  /**
   * @alias fieldTypes.SINGLE_SELECT
   * @memberof fieldTypes
   */
  SINGLE_SELECT: 'singleSelect',

  /**
   * @alias fieldTypes.MULTIPLE_SELECTS
   * @memberof fieldTypes
   */
  MULTIPLE_SELECTS: 'multipleSelects',

  /**
   * @alias fieldTypes.SINGLE_COLLABORATOR
   * @memberof fieldTypes
   */
  SINGLE_COLLABORATOR: 'singleCollaborator',

  /**
   * @alias fieldTypes.MULTIPLE_COLLABORATORS
   * @memberof fieldTypes
   */
  MULTIPLE_COLLABORATORS: 'multipleCollaborators',

  /**
   * @alias fieldTypes.MULTIPLE_RECORD_LINKS
   * @memberof fieldTypes
   */
  MULTIPLE_RECORD_LINKS: 'multipleRecordLinks',

  /**
   * @alias fieldTypes.DATE
   * @memberof fieldTypes
   */
  DATE: 'date',

  /**
   * @alias fieldTypes.DATE_TIME
   * @memberof fieldTypes
   */
  DATE_TIME: 'dateTime',

  /**
   * @alias fieldTypes.PHONE_NUMBER
   * @memberof fieldTypes
   */
  PHONE_NUMBER: 'phoneNumber',

  /**
   * @alias fieldTypes.MULTIPLE_ATTACHMENTS
   * @memberof fieldTypes
   */
  MULTIPLE_ATTACHMENTS: 'multipleAttachments',

  /**
   * @alias fieldTypes.CHECKBOX
   * @memberof fieldTypes
   */
  CHECKBOX: 'checkbox',

  /**
   * @alias fieldTypes.FORMULA
   * @memberof fieldTypes
   */
  FORMULA: 'formula',

  /**
   * @alias fieldTypes.CREATED_TIME
   * @memberof fieldTypes
   */
  CREATED_TIME: 'createdTime',

  /**
   * @alias fieldTypes.ROLLUP
   * @memberof fieldTypes
   */
  ROLLUP: 'rollup',

  /**
   * @alias fieldTypes.COUNT
   * @memberof fieldTypes
   */
  COUNT: 'count',

  /**
   * @alias fieldTypes.LOOKUP
   * @memberof fieldTypes
   */
  LOOKUP: 'lookup',

  /**
   * @alias fieldTypes.AUTO_NUMBER
   * @memberof fieldTypes
   */
  AUTO_NUMBER: 'autoNumber',

  /**
   * @alias fieldTypes.BARCODE
   * @memberof fieldTypes
   */
  BARCODE: 'barcode',

  /**
   * @alias fieldTypes.RATING
   * @memberof fieldTypes
   */
  RATING: 'rating',

  /**
   * @alias fieldTypes.RICH_TEXT
   * @memberof fieldTypes
   */
  RICH_TEXT: 'richText',

  /**
   * @alias fieldTypes.DURATION
   * @memberof fieldTypes
   */
  DURATION: 'duration',

  /**
   * @alias fieldTypes.LAST_MODIFIED_TIME
   * @memberof fieldTypes
   */
  LAST_MODIFIED_TIME: 'lastModifiedTime'
});
exports.FieldTypes = FieldTypes;