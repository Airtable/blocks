// @flow
export type FieldId = string;
export type PrivateColumnType = string;

/**
 * An enum of Airtable's field types
 * @alias fieldTypes
 * @example
 * import {fieldTypes} from '@airtable/blocks/models';
 * const numberFields = myTable.fields.filter(field => (
 *     field.type === fieldTypes.NUMBER
 * ));
 */
export const FieldTypes = Object.freeze({
    /**
     * @alias fieldTypes.SINGLE_LINE_TEXT
     * @memberof fieldTypes
     */
    SINGLE_LINE_TEXT: ('singleLineText': 'singleLineText'),
    /**
     * @alias fieldTypes.EMAIL
     * @memberof fieldTypes
     */
    EMAIL: ('email': 'email'),
    /**
     * @alias fieldTypes.URL
     * @memberof fieldTypes
     */
    URL: ('url': 'url'),
    /**
     * @alias fieldTypes.MULTILINE_TEXT
     * @memberof fieldTypes
     */
    MULTILINE_TEXT: ('multilineText': 'multilineText'),
    /**
     * @alias fieldTypes.NUMBER
     * @memberof fieldTypes
     */
    NUMBER: ('number': 'number'),
    /**
     * @alias fieldTypes.PERCENT
     * @memberof fieldTypes
     */
    PERCENT: ('percent': 'percent'),
    /**
     * @alias fieldTypes.CURRENCY
     * @memberof fieldTypes
     */
    CURRENCY: ('currency': 'currency'),
    /**
     * @alias fieldTypes.SINGLE_SELECT
     * @memberof fieldTypes
     */
    SINGLE_SELECT: ('singleSelect': 'singleSelect'),
    /**
     * @alias fieldTypes.MULTIPLE_SELECTS
     * @memberof fieldTypes
     */
    MULTIPLE_SELECTS: ('multipleSelects': 'multipleSelects'),
    /**
     * @alias fieldTypes.SINGLE_COLLABORATOR
     * @memberof fieldTypes
     */
    SINGLE_COLLABORATOR: ('singleCollaborator': 'singleCollaborator'),
    /**
     * @alias fieldTypes.MULTIPLE_COLLABORATORS
     * @memberof fieldTypes
     */
    MULTIPLE_COLLABORATORS: ('multipleCollaborators': 'multipleCollaborators'),
    /**
     * @alias fieldTypes.MULTIPLE_RECORD_LINKS
     * @memberof fieldTypes
     */
    MULTIPLE_RECORD_LINKS: ('multipleRecordLinks': 'multipleRecordLinks'),
    /**
     * @alias fieldTypes.DATE
     * @memberof fieldTypes
     */
    DATE: ('date': 'date'),
    /**
     * @alias fieldTypes.DATE_TIME
     * @memberof fieldTypes
     */
    DATE_TIME: ('dateTime': 'dateTime'),
    /**
     * @alias fieldTypes.PHONE_NUMBER
     * @memberof fieldTypes
     */
    PHONE_NUMBER: ('phoneNumber': 'phoneNumber'),
    /**
     * @alias fieldTypes.MULTIPLE_ATTACHMENTS
     * @memberof fieldTypes
     */
    MULTIPLE_ATTACHMENTS: ('multipleAttachments': 'multipleAttachments'),
    /**
     * @alias fieldTypes.CHECKBOX
     * @memberof fieldTypes
     */
    CHECKBOX: ('checkbox': 'checkbox'),
    /**
     * @alias fieldTypes.FORMULA
     * @memberof fieldTypes
     */
    FORMULA: ('formula': 'formula'),
    /**
     * @alias fieldTypes.CREATED_TIME
     * @memberof fieldTypes
     */
    CREATED_TIME: ('createdTime': 'createdTime'),
    /**
     * @alias fieldTypes.ROLLUP
     * @memberof fieldTypes
     */
    ROLLUP: ('rollup': 'rollup'),
    /**
     * @alias fieldTypes.COUNT
     * @memberof fieldTypes
     */
    COUNT: ('count': 'count'),
    /**
     * @alias fieldTypes.LOOKUP
     * @memberof fieldTypes
     */
    LOOKUP: ('lookup': 'lookup'),
    /**
     * @alias fieldTypes.AUTO_NUMBER
     * @memberof fieldTypes
     */
    AUTO_NUMBER: ('autoNumber': 'autoNumber'),
    /**
     * @alias fieldTypes.BARCODE
     * @memberof fieldTypes
     */
    BARCODE: ('barcode': 'barcode'),
    /**
     * @alias fieldTypes.RATING
     * @memberof fieldTypes
     */
    RATING: ('rating': 'rating'),
    /**
     * @alias fieldTypes.RICH_TEXT
     * @memberof fieldTypes
     */
    RICH_TEXT: ('richText': 'richText'),
    /**
     * @alias fieldTypes.DURATION
     * @memberof fieldTypes
     */
    DURATION: ('duration': 'duration'),
    /**
     * @alias fieldTypes.LAST_MODIFIED_TIME
     * @memberof fieldTypes
     */
    LAST_MODIFIED_TIME: ('lastModifiedTime': 'lastModifiedTime'),
});

export type FieldType = $Values<typeof FieldTypes>;

export type FieldData = {|
    id: FieldId,
    name: string,
    type: PrivateColumnType,
    typeOptions: ?{[string]: mixed},
|};
