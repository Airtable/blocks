"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.FieldTypes = void 0;
const FieldTypes = {
  SINGLE_LINE_TEXT: 'singleLineText',
  EMAIL: 'email',
  URL: 'url',
  MULTILINE_TEXT: 'multilineText',
  NUMBER: 'number',
  PERCENT: 'percent',
  CURRENCY: 'currency',
  SINGLE_SELECT: 'singleSelect',
  MULTIPLE_SELECTS: 'multipleSelects',
  SINGLE_COLLABORATOR: 'singleCollaborator',
  MULTIPLE_COLLABORATORS: 'multipleCollaborators',
  MULTIPLE_RECORD_LINKS: 'multipleRecordLinks',
  DATE: 'date',
  DATE_TIME: 'dateTime',
  PHONE_NUMBER: 'phoneNumber',
  MULTIPLE_ATTACHMENTS: 'multipleAttachments',
  CHECKBOX: 'checkbox',
  FORMULA: 'formula',
  CREATED_TIME: 'createdTime',
  ROLLUP: 'rollup',
  COUNT: 'count',
  LOOKUP: 'lookup',
  AUTO_NUMBER: 'autoNumber',
  BARCODE: 'barcode',
  RATING: 'rating',
  RICH_TEXT: 'richText',
  DURATION: 'duration',
  LAST_MODIFIED_TIME: 'lastModifiedTime'
};
exports.FieldTypes = FieldTypes;