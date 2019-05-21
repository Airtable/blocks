// @flow
export type FieldId = string;
export type PrivateColumnType = string;

export const FieldTypes = {
    SINGLE_LINE_TEXT: ('singleLineText': 'singleLineText'),
    EMAIL: ('email': 'email'),
    URL: ('url': 'url'),
    MULTILINE_TEXT: ('multilineText': 'multilineText'),
    NUMBER: ('number': 'number'),
    PERCENT: ('percent': 'percent'),
    CURRENCY: ('currency': 'currency'),
    SINGLE_SELECT: ('singleSelect': 'singleSelect'),
    MULTIPLE_SELECTS: ('multipleSelects': 'multipleSelects'),
    SINGLE_COLLABORATOR: ('singleCollaborator': 'singleCollaborator'),
    MULTIPLE_COLLABORATORS: ('multipleCollaborators': 'multipleCollaborators'),
    MULTIPLE_RECORD_LINKS: ('multipleRecordLinks': 'multipleRecordLinks'),
    DATE: ('date': 'date'),
    DATE_TIME: ('dateTime': 'dateTime'),
    PHONE_NUMBER: ('phoneNumber': 'phoneNumber'),
    MULTIPLE_ATTACHMENTS: ('multipleAttachments': 'multipleAttachments'),
    CHECKBOX: ('checkbox': 'checkbox'),
    FORMULA: ('formula': 'formula'),
    CREATED_TIME: ('createdTime': 'createdTime'),
    ROLLUP: ('rollup': 'rollup'),
    COUNT: ('count': 'count'),
    LOOKUP: ('lookup': 'lookup'),
    AUTO_NUMBER: ('autoNumber': 'autoNumber'),
    BARCODE: ('barcode': 'barcode'),
    RATING: ('rating': 'rating'),
    RICH_TEXT: ('richText': 'richText'),
    DURATION: ('duration': 'duration'),
    LAST_MODIFIED_TIME: ('lastModifiedTime': 'lastModifiedTime'),
};

export type FieldType = $Values<typeof FieldTypes>;

export type FieldData = {|
    id: FieldId,
    name: string,
    type: PrivateColumnType,
    typeOptions: ?{[string]: mixed},
|};
