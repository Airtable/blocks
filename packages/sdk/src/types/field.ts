/** @module @airtable/blocks/models: Field */ /** */
import {ObjectValues} from '../private_utils';

/** */
export type FieldId = string;
/** @hidden */
export type PrivateColumnType = string;

/**
 * An enum of Airtable's field types
 *
 * @alias fieldTypes
 * @example
 * ```js
 * import {fieldTypes} from '@airtable/blocks/models';
 * const numberFields = myTable.fields.filter(field => (
 *     field.type === fieldTypes.NUMBER
 * ));
 * ```
 */
export enum FieldTypes {
    /**
     * A single line of text.
     *
     * ##### Cell value format
     * ```js
     * string
     * ```
     *
     * ##### Options
     * None
     */
    SINGLE_LINE_TEXT = 'singleLineText',
    /**
     * A valid email address (e.g. andrew@example.com).
     *
     * ##### Cell value format
     * ```js
     * string
     * ```
     *
     * ##### Options
     * None
     */
    EMAIL = 'email',
    /**
     * A valid URL (e.g. airtable.com or https://airtable.com/universe).
     *
     * ###### Cell value format
     * ```js
     * string
     * ```
     *
     * ###### Options
     * None
     */
    URL = 'url',
    /**
     * A long text field that can span multiple lines.
     *
     * ###### Cell value format
     * ```js
     * string
     * ```
     *
     * Multiple lines of text, which may contain "mention tokens", e.g.
     * `<airtable:mention id="menE1i9oBaGX3DseR">@Alex</airtable:mention>`
     *
     * ###### Options
     * None
     */
    MULTILINE_TEXT = 'multilineText',
    /**
     * A number.
     *
     * ##### Cell value format
     * ```js
     * number
     * ```
     *
     * ##### Options
     * ```js
     * {
     *     precision: number,
     * }
     * ```
     */
    NUMBER = 'number',
    /**
     * A percentage - 0 is 0%, 1 is 100%.
     *
     * ##### Cell value format
     * ```js
     * number
     * ```
     *
     * ##### Options
     * ```js
     * {
     *     precision: number,
     * }
     * ```
     */
    PERCENT = 'percent',
    /**
     * An amount of a currency.
     *
     * ##### Cell value format
     * ```js
     * number
     * ```
     *
     * ##### Options
     * ```js
     * {
     *     precision: number,
     *     symbol: string,
     * }
     * ```
     */
    CURRENCY = 'currency',
    /**
     * Single select allows you to select a single option from predefined options in a dropdown.
     *
     * ##### Cell value format
     * ```js
     * {
     *     id: string,
     *     name: string,
     *     color?: Color
     * }
     * ```
     *
     * The currently selected choice.
     *
     * ##### Options
     * ```js
     * {
     *     choices: Array<{
     *         id: string,
     *         name: string,
     *         color?: Color,
     *     }>,
     * }
     * ```
     */
    SINGLE_SELECT = 'singleSelect',
    /**
     * Multiple select allows you to select one or more predefined options from a dropdown
     *
     * ##### Cell value format
     * ```js
     * Array<{
     *     id: string,
     *     name: string,
     *     color?: Color,
     * }>
     * ```
     *
     * Array of selected choices.
     *
     * ##### Options
     * ```js
     * {
     *     choices: Array<{
     *         id: string,
     *         name: string,
     *         color?: Color,
     *     }>,
     * }
     * ```
     */
    MULTIPLE_SELECTS = 'multipleSelects',
    /**
     * A collaborator field lets you add collaborators to your records. Collaborators can optionally be notified when they're added.
     *
     * ##### Cell value format
     * ```js
     * {
     *     id: string,
     *     email: string,
     *     name?: string,
     *     profilePicUrl?: string,
     * }
     * ```
     *
     * The currently selected choice.
     *
     * ##### Options
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
     */
    SINGLE_COLLABORATOR = 'singleCollaborator',
    /**
     * A collaborator field lets you add collaborators to your records. Collaborators can optionally be notified when they're added.
     *
     * ##### Cell value format
     * ```js
     * Array<{
     *     id: string,
     *     email: string,
     *     name?: string,
     *     profilePicUrl?: string,
     * }>
     * ```
     *
     * Array of selected choices.
     *
     * ##### Options
     * ```js
     * {
     *     choices: Array<{
     *         id: string,
     *         email: string,
     *         name?: string,
     *         profilePicUrl?: string,
     *     }>,
     * }
     */
    MULTIPLE_COLLABORATORS = 'multipleCollaborators',
    /**
     * Link to another record.
     *
     * ##### Cell value format
     * ```js
     * Array<{
     *     id: RecordId,
     *     name: string,
     * }>
     * ```
     *
     * Array of selected record IDs and their primary cell values from the linked table.
     *
     * ##### Options
     * ```js
     * {
     *     // The ID of the table this field links to
     *     linkedTableId: TableId,
     *     // The ID of the field in the linked table that links back to this one
     *     inverseLinkFieldId?: FieldId,
     *     // The ID of the view in the linked table to use when showing a list of records to select from
     *     viewIdForRecordSelection?: ViewId,
     * }
     * ```
     */
    MULTIPLE_RECORD_LINKS = 'multipleRecordLinks',
    /**
     * A date.
     *
     * ##### Cell value format
     * ```js
     * string
     * ```
     *
     * An [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date.
     *
     * ##### Options
     * ```js
     * {
     *     dateFormat: {
     *         name: 'local' | 'friendly' | 'us' | 'european' | 'iso',
     *         // a date format string as documented here: https://momentjs.com/docs/#/parsing/string-format/
     *         format: string,
     *     }
     * }
     * ```
     */
    DATE = 'date',
    /**
     * A date & time.
     *
     * ##### Cell value format
     * ```js
     * string
     * ```
     *
     * An [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time.
     *
     * ##### Options
     * ```js
     * {
     *     dateFormat: {
     *         name: 'local' | 'friendly' | 'us' | 'european' | 'iso',
     *         // a date format string as documented here: https://momentjs.com/docs/#/parsing/string-format/
     *         format: string,
     *     },
     *     timeFormat: {
     *         name: '12hour' | '24hour',
     *         // a time format string as documented here: https://momentjs.com/docs/#/parsing/string-format/
     *         format: string,
     *     },
     *     timeZone: 'utc' | 'client',
     * }
     * ```
     */
    DATE_TIME = 'dateTime',
    /**
     * A telephone number (e.g. (415) 555-9876).
     *
     * ##### Cell value format
     * ```js
     * string
     * ```
     *
     * ##### Options
     * None
     */
    PHONE_NUMBER = 'phoneNumber',
    /**
     * Attachments allow you to add images, documents, or other files which can then be viewed or downloaded.
     *
     * ##### Cell value format
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
     * ##### Options
     * None
     */
    MULTIPLE_ATTACHMENTS = 'multipleAttachments',
    /**
     * A checkbox.
     *
     * ##### Cell value format
     * ```js
     * boolean
     * ```
     *
     * This field is "true" when checked and otherwise empty.
     *
     * ##### Options
     * ```js
     * {
     *     // an {@link Icon} name
     *     icon: string,
     *     // the color of the check box
     *     color: Color,
     * }
     * ```
     */
    CHECKBOX = 'checkbox',
    /**
     * Compute a value in each record based on other fields in the same record.
     *
     * ##### Cell value format
     * ```js
     * any
     * ```
     *
     * Check `options.result` to know the resulting field type.
     *
     * ##### Options
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
     */
    FORMULA = 'formula',
    /**
     * The time the record was created in UTC.
     *
     * ##### Cell value format
     * ```js
     * string
     * ```
     *
     * An [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time.
     *
     * ##### Options
     * ```js
     * {
     *     result: {
     *         type: 'date' | 'dateTime',
     *         options: DateOrDateTimeFieldOptions,
     *     },
     * }
     * ```
     *
     * See {@link fieldTypes.DATE} and {@link fieldTypes.DATE_TIME} for `result` options.
     */
    CREATED_TIME = 'createdTime',
    /**
     * A rollup allows you to summarize data from records that are linked to this table.
     *
     * ##### Cell value format
     * ```js
     * any
     * ```
     *
     * Check `options.result` to know the resulting field type.
     *
     * ##### Options
     * ```js
     * {
     *     // false if the formula contains an error
     *     isValid: boolean,
     *     // the linked record field in this table that this field is summarizing.
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
     */
    ROLLUP = 'rollup',
    /**
     * Count the number of linked records.
     *
     * ##### Cell value format
     * ```js
     * number
     * ```
     *
     * ##### Options
     * ```js
     * {
     *    // is the field currently valid (false if e.g. the linked record field is switched to a different type)
     *    isValid: boolean,
     *    // the linked record field in this table that we're counting
     *    recordLinkFieldId: FieldId,
     * }
     * ```
     */
    COUNT = 'count',
    /**
     * Lookup a field on linked records.
     *
     * ##### Cell value format
     * UNSTABLE
     *
     * ##### Options
     * UNSTABLE
     */
    MULTIPLE_LOOKUP_VALUES = 'multipleLookupValues',
    /**
     * Automatically incremented unique counter for each record.
     *
     * ##### Cell value format
     * ```js
     * number
     * ```
     *
     * ##### Options
     * None
     */
    AUTO_NUMBER = 'autoNumber',
    /**
     * Use the Airtable iOS or Android app to scan barcodes.
     *
     * ##### Cell value format
     * ```js
     * {
     *     // the text value of the barcode
     *     text: string,
     *     // the type of barcode
     *     type?: string,
     * }
     * ```
     *
     * ##### Options
     * None
     */
    BARCODE = 'barcode',
    /**
     * A rating (e.g. stars out of 5)
     *
     * ##### Cell value format
     * ```js
     * number
     * ```
     *
     * ##### Options
     * ```js
     * {
     *     // the {@link Icon} name used to display the rating
     *     icon: string,
     *     // the maximum value for the rating
     *     max: number,
     *     // the color of selected icons
     *     color: Color,
     * }
     * ```
     */
    RATING = 'rating',
    /**
     * @internal - not yet generally avail
     */
    RICH_TEXT = 'richText',
    /**
     * A duration of time in seconds.
     *
     * ##### Cell value format
     * ```js
     * number
     * ```
     *
     * ##### Options
     * ```js
     * {
     *     // a time format string as documented here: https://momentjs.com/docs/#/parsing/string-format/
     *     durationFormat: string,
     * }
     * ```
     */
    DURATION = 'duration',
    /**
     * Shows the date and time that a record was most recently modified in any editable field or
     * just in specific editable fields.
     *
     * ##### Cell value format
     * ```js
     * string
     * ```
     *
     * An [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time.
     *
     * ##### Options
     * ```js
     * {
     *     // false if the formula contains an error
     *     isValid: boolean,
     *     // the fields to check the last modified time of
     *     referencedFieldIds: Array<FieldId>,
     *     // the cell value result type
     *     result: {
     *         type: 'date' | 'dateTime',
     *         options: DateOrDateTimeFieldOptions,
     *     },
     * }
     * ```
     *
     * See {@link fieldTypes.DATE} and {@link fieldTypes.DATE_TIME} for `result` options.
     */
    LAST_MODIFIED_TIME = 'lastModifiedTime',
}

/** */
export type FieldType = ObjectValues<typeof FieldTypes>;

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
