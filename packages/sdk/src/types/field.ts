/** @module @airtable/blocks/models: Field */ /** */
/** */
export type FieldId = string;
/** @hidden */
export type PrivateColumnType = string;

/**
 * An enum of Airtable's field types
 *
 * @example
 * ```js
 * import {FieldType} from '@airtable/blocks/models';
 * const numberFields = myTable.fields.filter(field => (
 *     field.type === FieldType.NUMBER
 * ));
 * ```
 */
export enum FieldType {
    /**
     * A single line of text.
     *
     * **Field options**
     *
     * n/a
     *
     * **Cell read format**
     * ```js
     * string
     * ```
     *
     * **Cell write format**
     * ```js
     * string
     * ```
     */
    SINGLE_LINE_TEXT = 'singleLineText',
    /**
     * A valid email address (e.g. andrew@example.com).
     *
     * **Field options**
     *
     * n/a
     *
     * **Cell read format**
     * ```js
     * string
     * ```
     *
     * **Cell write format**
     * ```js
     * string
     * ```
     */
    EMAIL = 'email',
    /**
     * A valid URL (e.g. airtable.com or https://airtable.com/universe).
     *
     * **Field options**
     *
     * n/a
     *
     * **Cell read format**
     * ```js
     * string
     * ```
     *
     * **Cell write format**
     * ```js
     * string
     * ```
     */
    URL = 'url',
    /**
     * A long text field that can span multiple lines. May contain "mention tokens",
     * e.g. `<airtable:mention id="menE1i9oBaGX3DseR">@Alex</airtable:mention>`
     *
     * **Field options**
     *
     * n/a
     *
     * **Cell read format**
     * ```js
     * string
     * ```
     *
     * **Cell write format**
     * ```js
     * string
     * ```
     */
    MULTILINE_TEXT = 'multilineText',
    /**
     * A number.
     *
     * The `precision` option indicates the number of digits shown to the right of
     * the decimal point for this field.
     *
     * **Field options**
     * ```js
     * { precision: number }
     * ```
     *
     * **Cell read format**
     * ```js
     * number
     * ```
     *
     * **Cell write format**
     * ```js
     * number
     * ```
     */
    NUMBER = 'number',
    /**
     * A percentage.
     *
     * When reading from and writing to a "Percent" field, the cell value is a decimal.
     * For example, 0 is 0%, 0.5 is 50%, and 1 is 100%.
     *
     * **Field options**
     * ```js
     * { precision: number }
     * ```
     *
     * **Cell read format**
     * ```js
     * number
     * ```
     *
     * **Cell write format**
     * ```js
     * number
     * ```
     */
    PERCENT = 'percent',
    /**
     * An amount of a currency.
     *
     * **Field options**
     * ```js
     * {
     *     precision: number,
     *     symbol: string,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * number
     * ```
     *
     * **Cell write format**
     * ```js
     * number
     * ```
     */
    CURRENCY = 'currency',
    /**
     * Single select allows you to select a single option from predefined options in a dropdown.
     *
     * **Field options**
     * ```js
     * {
     *     choices: Array<{
     *         id: string,
     *         name: string,
     *         color?: Color,
     *     }>,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * {
     *     id: string,
     *     name: string,
     *     color?: Color
     * }
     * ```
     *
     * **Cell write format**
     * ```js
     * { id: string } | { name: string }
     * ```
     */
    SINGLE_SELECT = 'singleSelect',
    /**
     * Multiple select allows you to select one or more predefined options from a dropdown
     *
     * Similar to MULTIPLE_ATTACHMENTS and MULTIPLE_COLLABORATORS, this array-type field
     * will override the current cell value when being updated. Be sure to spread the current
     * cell value if you want to keep the currently selected choices.
     *
     * **Field Options**
     * ```js
     * {
     *     choices: Array<{
     *         id: string,
     *         name: string,
     *         color?: Color,
     *     }>,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * Array<{
     *     id: string,
     *     name: string,
     *     color?: Color,
     * }>
     * ```
     * The currently selected choices.
     *
     * **Cell write format**
     * ```js
     * Array<{id: string} | {name: string}>
     * ```
     */
    MULTIPLE_SELECTS = 'multipleSelects',
    /**
     * A collaborator field lets you add collaborators to your records. Collaborators can optionally
     * be notified when they're added. A single collaborator field has been configured to only
     * reference one collaborator.
     *
     * **Field Options**
     * ```js
     * {
     *     choices: Array<{
     *         id: string,
     *         email: string,
     *         name?: string,
     *         profilePicUrl?: string,
     *     }>,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * {
     *     id: string,
     *     email: string,
     *     name?: string,
     *     profilePicUrl?: string,
     * }
     * ```
     * The currently selected collaborator.
     *
     * **Cell write format**
     * ```js
     * { id: string }
     * ```
     *
     */
    SINGLE_COLLABORATOR = 'singleCollaborator',
    /**
     * A collaborator field lets you add collaborators to your records. Collaborators can optionally
     * be notified when they're added. A multiple collaborator field has been configured to
     * reference any number of collaborators.
     *
     * Similar to MULTIPLE_ATTACHMENTS and MULTIPLE_COLLABORATORS, this array-type field
     * will override the current cell value when being updated. Be sure to spread the current
     * cell value if you want to keep the currently selected collaborators.
     *
     * **Field Options**
     * ```js
     * {
     *     choices: Array<{
     *         id: string,
     *         email: string,
     *         name?: string,
     *         profilePicUrl?: string,
     *     }>,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * Array<{
     *     id: string,
     *     email: string,
     *     name?: string,
     *     profilePicUrl?: string,
     * }>
     * ```
     * The currently selected collaborators.
     *
     * **Cell write format**
     * ```js
     * Array<{ id: string }>
     * ```
     */
    MULTIPLE_COLLABORATORS = 'multipleCollaborators',
    /**
     * Link to another record.
     *
     * When updating an existing linked record cell value, the specified array will
     * overwrite the current cell value. If you want to add a new linked record without
     * deleting the current linked records, you can spread the current cell value like so:
     * ```js
     * const newForeginRecordIdToLink = 'recXXXXXXXXXXXXXX';
     * myTable.updateRecordAsync(myRecord, {
     *     'myLinkedRecordField': [
     *         ...myRecord.getCellValue('myLinkedRecordField'),
     *         { id: newForeignRecordIdToLink }
     *     ]
     * })
     * ```
     *
     * Similarly, you can clear the current cell value by passing an empty array, or
     * remove specific linked records by passing a filtered array of the current cell
     * value.
     *
     * **Field options**
     * ```js
     * {
     *     // The ID of the table this field links to
     *     linkedTableId: TableId,
     *     // The ID of the field in the linked table that links back
     *     // to this one
     *     inverseLinkFieldId?: FieldId,
     *     // The ID of the view in the linked table to use when showing
     *     // a list of records to select from
     *     viewIdForRecordSelection?: ViewId,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * Array<{
     *     id: RecordId,
     *     name: string,
     * }>
     * ```
     * The currently linked record IDs and their primary cell values from the linked table.
     *
     * **Cell write format**
     * ```js
     * Array<{ id: RecordId }>
     * ```
     *
     */
    MULTIPLE_RECORD_LINKS = 'multipleRecordLinks',
    /**
     * A date.
     *
     * When reading from and writing to a date field, the cell value will always be an
     * [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date.
     *
     * The date format string follows the moment.js structure documented
     * [here](https://momentjs.com/docs/#/parsing/string-format/)
     *
     * **Field options**
     * ```js
     * {
     *     dateFormat: {
     *         name: 'local' | 'friendly' | 'us' | 'european' | 'iso',
     *         format: string,
     *     }
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * string
     * ```
     *
     * **Cell write format**
     * ```js
     * Date | string
     * ```
     *
     */
    DATE = 'date',
    /**
     * A date field configured to also include a time.
     *
     * When reading from and writing to a date time field, the cell value will always be an
     * [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time.
     *
     * The date and time format strings follow the moment.js structure documented
     * [here](https://momentjs.com/docs/#/parsing/string-format/)
     *
     * **Field options**
     * ```js
     * {
     *     dateFormat: {
     *         name: 'local' | 'friendly' | 'us' | 'european' | 'iso',
     *         format: string,
     *     },
     *     timeFormat: {
     *         name: '12hour' | '24hour',
     *         format: string,
     *     },
     *     timeZone: 'utc' | 'client',
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * string
     * ```
     *
     * **Cell write format**
     * ```js
     * Date | string
     * ```
     *
     */
    DATE_TIME = 'dateTime',
    /**
     * A telephone number (e.g. (415) 555-9876).
     *
     * **Cell read format**
     * ```js
     * string
     * ```
     *
     * **Field options**
     * None
     */
    PHONE_NUMBER = 'phoneNumber',
    /**
     * Attachments allow you to add images, documents, or other files which can then be viewed or downloaded.
     *
     * When updating an existing attachment cell value, the specified array will
     * overwrite the current cell value. If you want to add a new attachment without
     * deleting the current attachments, you can spread the current cell value like so:
     * ```js
     * const newAttachmentUrl = 'example.com/cute-cats.jpeg';
     * myTable.updateRecordAsync(myRecord, {
     *     'myAttachmentField': [
     *         ...myRecord.getCellValue('myAttachmentField'),
     *         { url: newAttachmentUrl }
     *     ]
     * })
     * ```
     *
     * Similarly, you can clear the current cell value by passing an empty array, or
     * remove specific attachments by passing a filtered array of the current cell
     * value.
     *
     * Note: when you pass an existing attachment, you must pass the full attachment
     * object. New attachments only require the `url` property.
     *
     * **Field options**
     *
     * n/a
     *
     * **Cell read format**
     * ```js
     * Array<{
     *     // unique attachment id
     *     id: string,
     *     // url, e.g. "https://dl.airtable.com/foo.jpg"
     *     url: string,
     *     // filename, e.g. "foo.jpg"
     *     filename: string,
     *     // file size, in bytes
     *     size?: number,
     *     // content type, e.g. "image/jpeg"
     *     type?: string,
     *     // thumbnails if available
     *     thumbnails?: {
     *         small?: {
     *             url: string,
     *             width: number,
     *             height: number,
     *         },
     *         large?: {
     *             url: string,
     *             width: number,
     *             height: number,
     *         },
     *         full?: {
     *             url: string,
     *             width: number,
     *             height: number,
     *         },
     *     },
     * }>
     * ```
     *
     * **Cell write format**
     * ```js
     * Array<{ url: string }>
     * ```
     */
    MULTIPLE_ATTACHMENTS = 'multipleAttachments',
    /**
     * A checkbox.
     *
     * This field is "true" when checked and otherwise empty.
     *
     *
     * **Field options**
     *
     * ```js
     * {
     *     // an icon name
     *     icon: string,
     *     // the color of the check box
     *     color: Color,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * boolean
     * ```
     *
     * **Cell write format**
     * ```js
     * boolean
     * ```
     *
     */
    CHECKBOX = 'checkbox',
    /**
     * Compute a value in each record based on other fields in the same record.
     *
     * **Field options**
     * ```js
     * {
     *     // false if the formula contains an error
     *     isValid: boolean,
     *     // the other fields in the record that are used in the formula
     *     referencedFieldIds: Array<FieldId>,
     *     // the resulting field type and options returned by the formula
     *     result: {
     *         // the field type of the formula result
     *         type: string,
     *         // that types options
     *         options?: any,
     *     },
     * }
     * ```
     *
     * **Cell read format**
     *
     * Check `options.result` to know the resulting field type.
     * ```js
     * any
     * ```
     *
     * **Cell write format**
     *
     * n/a
     *
     */
    FORMULA = 'formula',
    /**
     * The time the record was created in UTC.
     *
     * When reading from a "Created time" field, the cell value will always be an
     * [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time
     *
     * **Field options**
     * ```js
     * {
     *     result: {
     *         type: 'date' | 'dateTime',
     *         // See DATE and DATE_TIME for detailed field options
     *         options: DateOrDateTimeFieldOptions,
     *     },
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * string
     * ```
     *
     * **Cell write format**
     *
     * n/a
     */
    CREATED_TIME = 'createdTime',
    /**
     * A rollup allows you to summarize data from records that are linked to this table.
     *
     * **Field options**
     * ```js
     * {
     *     // false if the formula contains an error
     *     isValid: boolean,
     *     // the linked record field in this table that this field is
     *     // summarizing.
     *     recordLinkFieldId: FieldId,
     *     // the field id in the linked table that this field is summarizing.
     *     fieldIdInLinkedTable: FieldId,
     *     // the other fields in the record that are used in the formula
     *     referencedFieldIds: Array<FieldId>,
     *     // the resulting field type and options returned by the formula
     *     result: {
     *         // the field type of the formula result
     *         type: string,
     *         // that types options
     *         options?: any,
     *     },
     * }
     * ```
     *
     * **Cell read format**
     * Check `options.result` to know the resulting field type.
     * ```js
     * any
     * ```
     *
     * **Cell write format**
     *
     * n/a
     *
     */
    ROLLUP = 'rollup',
    /**
     * Count the number of linked records.
     *
     * **Field options**
     * ```js
     * {
     *    // is the field currently valid (e.g. false if the linked record
     *    // field has been changed to a different field type)
     *    isValid: boolean,
     *    // the linked record field in this table that we're counting
     *    recordLinkFieldId: FieldId,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * number
     * ```
     *
     * **Cell write format**
     *
     * n/a
     */
    COUNT = 'count',
    /**
     * Lookup a field on linked records.
     *
     * **Field options**
     * 
     * UNSTABLE

     * **Cell read format**
     * 
     * UNSTABLE
     *
     * **Cell write format**
     * 
     * n/a
     */
    MULTIPLE_LOOKUP_VALUES = 'multipleLookupValues',
    /**
     * Automatically incremented unique counter for each record.
     *
     * **Field options**
     *
     * n/a
     *
     * **Cell read format**
     * ```js
     * number
     * ```
     *
     * **Cell write format**
     *
     * n/a
     */
    AUTO_NUMBER = 'autoNumber',
    /**
     * Use the Airtable iOS or Android app to scan barcodes.
     *
     * **Field options**
     *
     * n/a
     *
     * **Cell read format**
     * ```js
     * {
     *     // the text value of the barcode
     *     text: string,
     *     // the type of barcode
     *     type?: string,
     * }
     * ```
     *
     * **Cell write format**
     *
     * n/a
     */
    BARCODE = 'barcode',
    /**
     * A rating (e.g. stars out of 5)
     *
     * **Field options**
     * ```js
     * {
     *     // the icon name used to display the rating
     *     icon: string,
     *     // the maximum value for the rating
     *     max: number,
     *     // the color of selected icons
     *     color: Color,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * number
     * ```
     *
     * **Cell write format**
     *
     * n/a
     */
    RATING = 'rating',
    /**
     * @internal - not yet generally avail
     */
    RICH_TEXT = 'richText',
    /**
     * A duration of time in seconds.
     *
     *
     * The `durationFormat` string follows the moment.js structure documented
     * [here](https://momentjs.com/docs/#/parsing/string-format/).
     *
     * **Field options**
     * ```js
     * {
     *     durationFormat: string,
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * number
     * ```
     *
     * **Cell write format**
     * ```js
     * number
     * ```
     */
    DURATION = 'duration',
    /**
     * Shows the date and time that a record was most recently modified in any editable field or
     * just in specific editable fields.
     *
     * When reading from a "Last modified time" field, the cell value will always be an
     * [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time
     *
     * **Field options**
     * ```js
     * {
     *     // false if the formula contains an error
     *     isValid: boolean,
     *     // the fields to check the last modified time of
     *     referencedFieldIds: Array<FieldId>,
     *     // the cell value result type
     *     result: {
     *         type: 'date' | 'dateTime',
     *         // See DATE and DATE_TIME for detailed field options
     *         options: DateOrDateTimeFieldOptions,
     *     },
     * }
     * ```
     *
     * **Cell read format**
     * ```js
     * string
     * ```
     *
     * **Cell write format**
     *
     * n/a
     *
     */
    LAST_MODIFIED_TIME = 'lastModifiedTime',
}

/** @hidden */
export type FieldLock = unknown;
/** @hidden */
export interface FieldData {
    id: FieldId;
    name: string;
    type: PrivateColumnType;
    typeOptions: {[key: string]: unknown} | null | undefined;
    description: string | null;
    lock: FieldLock | null;
}

/** @hidden */
export interface FieldPermissionData {
    readonly id: FieldId;
    readonly name: string;
    readonly type: PrivateColumnType;
    readonly lock: FieldLock | null;
}
