/** @module @airtable/blocks/models: Field */ /** */
import {Color} from '../colors';
import {TableId} from './table';
import {ViewId} from './view';

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
     * **Cell format**
     * ```js
     * string
     * ```
     *
     * **Field options**
     *
     * n/a
     */
    SINGLE_LINE_TEXT = 'singleLineText',
    /**
     * A valid email address (e.g. andrew@example.com).
     *
     * **Cell format**
     * ```js
     * string
     * ```
     *
     * **Field options**
     *
     * n/a
     */
    EMAIL = 'email',
    /**
     * A valid URL (e.g. airtable.com or https://airtable.com/universe).
     *
     * **Cell format**
     * ```js
     * string
     * ```
     *
     * **Field options**
     *
     * n/a
     */
    URL = 'url',
    /**
     * A long text field that can span multiple lines. May contain "mention tokens",
     * e.g. `<airtable:mention id="menE1i9oBaGX3DseR">@Alex</airtable:mention>`
     *
     * **Cell format**
     * ```js
     * string
     * ```
     *
     * **Field options**
     *
     * n/a
     */
    MULTILINE_TEXT = 'multilineText',
    /**
     * A number.
     *
     * The `precision` option indicates the number of digits shown to the right of
     * the decimal point for this field.
     *
     * **Cell format**
     * ```js
     * number
     * ```
     *
     * **Field options**
     * ```js
     * {
     *     precision: number, // from 0 to 8 inclusive
     * }
     * ```
     */
    NUMBER = 'number',
    /**
     * A percentage.
     *
     * When reading from and writing to a "Percent" field, the cell value is a decimal.
     * For example, 0 is 0%, 0.5 is 50%, and 1 is 100%.
     *
     * **Cell format**
     * ```js
     * number
     * ```
     *
     * **Field options**
     * ```js
     * {
     *     precision: number, // from 0 to 8 inclusive
     * }
     * ```
     */
    PERCENT = 'percent',
    /**
     * An amount of a currency.
     *
     * **Cell format**
     * ```js
     * number
     * ```
     *
     * **Field options**
     * ```js
     * {
     *     precision: number, // from 0 to 7 inclusive
     *     symbol: string,
     * }
     * ```
     */
    CURRENCY = 'currency',
    /**
     * Single select allows you to select a single choice from predefined choices in a dropdown.
     *
     * **Cell read format**
     * ```js
     * {
     *     id: string,
     *     name: string,
     *     color?: Color
     * }
     * ```
     * The currently selected choice.
     *
     * **Cell write format**
     * ```js
     * { id: string } | { name: string }
     * ```
     *
     * **Field options read format**
     * ```js
     * {
     *     choices: Array<{
     *         id: string,
     *         name: string,
     *         color?: {@link Color}, // Color is not provided when field coloring is disabled.
     *     }>,
     * }
     * ```
     *
     * All colors except base colors from {@link Color} can be used as choice colors (e.g.
     * "blueBright", "blueDark1", "blueLight1", "blueLight2" are supported, "blue" is not)
     *
     * Bases on a free or plus plan are limited to colors ending in "Light2".
     *
     * **Field options write format**
     * ```js
     * {
     *     choices: Array<
     *         // New choice format
     *         {name: string, color?: {@link Color}} |
     *         // Pre-existing choices use read format specified above
     *     >,
     * }
     * ```
     * The default behavior of calling `updateOptionsAsync` on a `SINGLE_SELECT` field allows
     * choices to be added or updated, but not deleted. Therefore, you should pass all pre-existing
     * choices in `choices` (similar to updating a `MULTIPLE_SELECTS` field type cell value). You can
     * do this by spreading the current choices:
     * ```js
     * const selectField = table.getFieldByName('My select field');
     * await selectField.updateOptionsAsync({
     *     choices: [
     *         ...selectField.options.choices,
     *         {name: 'My new choice'},
     *     ],
     * });
     *
     * ```
     *
     * If you want to allow choices to be deleted, you can pass an object with
     * `enableSelectFieldChoiceDeletion: true` as the second argument. By passing this argument,
     * any existing choices which are not passed again via `choices` will be deleted, and any
     * cells which referenced a now-deleted choice will be cleared.
     * ```js
     * const selectField = table.getFieldByName('My select field');
     * await selectField.updateOptionsAsync(
     *     {
     *         choices: selectField.options.choices.filter((choice) => choice.name !== 'Choice to delete'),
     *     },
     *     {enableSelectFieldChoiceDeletion: true},
     * );
     *
     * ```
     */
    SINGLE_SELECT = 'singleSelect',
    /**
     * Multiple select allows you to select one or more predefined choices from a dropdown
     *
     * Similar to MULTIPLE_ATTACHMENTS and MULTIPLE_COLLABORATORS, this array-type field
     * will override the current cell value when being updated. Be sure to spread the current
     * cell value if you want to keep the currently selected choices.
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
     *
     * **Field options read format**
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
     * **Field options write format**
     * ```js
     * {
     *     choices: Array<
     *         // New choice format
     *         {name: string, color?: Color} |
     *         // Pre-existing choices use read format specified above
     *     >,
     * }
     * ```
     * The default behavior of calling `updateOptionsAsync` on a `MULTIPLE_SELECTS` field allows
     * choices to be added or updated, but not deleted. Therefore, you should pass all pre-existing
     * choices in `choices` (similar to updating a `SINGLE_SELECT` field type cell value). You can
     * do this by spreading the current choices:
     * ```js
     * const multipleSelectField = table.getFieldByName('My multiple select field');
     * await multipleSelectField.updateOptionsAsync({
     *     choices: [
     *         ...multipleSelectField.options.choices,
     *         {name: 'My new choice'},
     *     ],
     * });
     *
     * ```
     *
     * If you want to allow choices to be deleted, you can pass an object with
     * `enableSelectFieldChoiceDeletion: true` as the second argument. By passing this argument,
     * any existing choices which are not passed again via `choices` will be deleted, and any
     * cells which referenced a now-deleted choice will be cleared.
     * ```js
     * const multipleSelectField = table.getFieldByName('My multiple select field');
     * await multipleSelectField.updateOptionsAsync(
     *     {
     *         choices: multipleSelectField.options.choices.filter((choice) => choice.name !== 'Choice to delete'),
     *     },
     *     {enableSelectFieldChoiceDeletion: true},
     * );
     *
     * ```
     */
    MULTIPLE_SELECTS = 'multipleSelects',
    /**
     * A collaborator field lets you add collaborators to your records. Collaborators can optionally
     * be notified when they're added. A single collaborator field has been configured to only
     * reference one user collaborator.
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
     * The currently selected user collaborator.
     *
     * **Cell write format**
     * ```js
     * { id: string }
     * ```
     *
     * **Field options read format**
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
     * **Field options write format**
     *
     * N/A
     *
     * Options are not required when creating a `SINGLE_COLLABORATOR` field, and updating options is
     * not supported.
     *
     */
    SINGLE_COLLABORATOR = 'singleCollaborator',
    /**
     * A collaborator field lets you add collaborators to your records. Collaborators can optionally
     * be notified when they're added. A multiple collaborator field has been configured to
     * reference any number of user or user group collaborators.
     *
     * Note: Adding user groups to multiple collaborator fields is an upcoming enterprise feature currently
     * in beta, and will be generally released on August 29, 2022.
     *
     * Similar to MULTIPLE_ATTACHMENTS and MULTIPLE_SELECTS, this array-type field
     * will override the current cell value when being updated. Be sure to spread the current
     * cell value if you want to keep the currently selected collaborators.
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
     * The currently selected user or user group collaborators. The email property is either the email
     * address of the user collaborator or an RFC 2822 mailbox-list (comma-separated list of emails) that
     * can be used to contact all members of the user group collaborator.
     *
     * **Cell write format**
     * ```js
     * Array<{ id: string }>
     * ```
     *
     * **Field options read format**
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
     * **Field options write format**
     *
     * N/A
     *
     * Options are not required when creating a `MULTIPLE_COLLABORATORS` field, and updating options
     * is not supported.
     */
    MULTIPLE_COLLABORATORS = 'multipleCollaborators',
    /**
     * Link to another record.
     *
     * When updating an existing linked record cell value, the specified array will
     * overwrite the current cell value. If you want to add a new linked record without
     * deleting the current linked records, you can spread the current cell value like so:
     * ```js
     * const newForeignRecordIdToLink = 'recXXXXXXXXXXXXXX';
     * myTable.updateRecordAsync(myRecord, {
     *     'myLinkedRecordField': [
     *         ...myRecord.getCellValue('myLinkedRecordField'),
     *         { id: newForeignRecordIdToLink }
     *     ]
     * });
     * ```
     *
     * Similarly, you can clear the current cell value by passing an empty array, or
     * remove specific linked records by passing a filtered array of the current cell
     * value.
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
     * **Field options read format**
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
     *     // Whether linked records are rendered in the reverse order from the cell value in the
     *     // Airtable UI (i.e. most recent first)
     *     // You generally do not need to rely on this option.
     *     isReversed: boolean,
     *     // Whether this field prefers to only have a single linked record. While this preference
     *     // is enforced in the Airtable UI, it is possible for a field that prefers single linked
     *     // records to have multiple record links (for example, via copy-and-paste or programmatic
     *     // updates).
     *     prefersSingleRecordLink: boolean,
     * }
     * ```
     *
     * **Field options write format**
     * ```js
     * {
     *     // The ID of the table this field links to
     *     linkedTableId: TableId,
     *     // The ID of the view in the linked table to use when showing
     *     // a list of records to select from
     *     viewIdForRecordSelection?: ViewId,
     *     // Note: prefersSingleRecordLink cannot be specified via programmatic field creation
     *     // and will be false for fields created within an app
     * }
     * ```
     *
     * Creating `MULTIPLE_RECORD_LINKS` fields is supported but updating options for existing
     * `MULTIPLE_RECORD_LINKS` fields is not supported.
     */
    MULTIPLE_RECORD_LINKS = 'multipleRecordLinks',
    /**
     * A date.
     *
     * When reading from and writing to a date field, the cell value will always be an
     * [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date. (Field
     * options specify how it's formatted in the main Airtable UI - `format` can be used with
     * [`moment.js`](https://momentjs.com/) to match that.)
     *
     * The date format string follows the moment.js structure documented
     * [here](https://momentjs.com/docs/#/parsing/string-format/)
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
     * **Field options read format**
     * ```js
     * {
     *     dateFormat:
     *          | {name: 'local', format: 'l'}
     *          | {name: 'friendly', format: 'LL'}
     *          | {name: 'us', format: 'M/D/YYYY'}
     *          | {name: 'european', format: 'D/M/YYYY'}
     *          | {name: 'iso', format: 'YYYY-MM-DD'}
     * }
     * ```
     *
     * **Field options write format**
     * ```js
     * {
     *     dateFormat:
     *          // Format is optional, but must match name if provided.
     *          | {name: 'local', format?: 'l'}
     *          | {name: 'friendly', format?: 'LL'}
     *          | {name: 'us', format?: 'M/D/YYYY'}
     *          | {name: 'european', format?: 'D/M/YYYY'}
     *          | {name: 'iso', format?: 'YYYY-MM-DD'}
     * }
     * ```
     */
    DATE = 'date',
    /**
     * A date field configured to also include a time.
     *
     * When reading from and writing to a date field, the cell value will always be an
     * [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date. (Field
     * options specify how it's formatted in the main Airtable UI - `format` can be used with
     * [`moment.js`](https://momentjs.com/) to match that.)
     *
     * The date and time format strings follow the moment.js structure documented
     * [here](https://momentjs.com/docs/#/parsing/string-format/)
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
     * **Field options read format**
     * ```js
     * {
     *     dateFormat:
     *          | {name: 'local', format: 'l'}
     *          | {name: 'friendly', format: 'LL'}
     *          | {name: 'us', format: 'M/D/YYYY'}
     *          | {name: 'european', format: 'D/M/YYYY'}
     *          | {name: 'iso', format: 'YYYY-MM-DD'},
     *     timeFormat:
     *          | {name: '12hour', format: 'h:mma'}
     *          | {name: '24hour', format: 'HH:mm'},
     *     timeZone: 'utc' | 'client',
     * }
     * ```
     *
     * **Field options write format**
     * ```js
     * {
     *     dateFormat:
     *          // Format is optional, but must match name if provided.
     *          | {name: 'local', format?: 'l'}
     *          | {name: 'friendly', format?: 'LL'}
     *          | {name: 'us', format?: 'M/D/YYYY'}
     *          | {name: 'european', format?: 'D/M/YYYY'}
     *          | {name: 'iso', format?: 'YYYY-MM-DD'},
     *     timeFormat:
     *          // Format is optional, but must match name if provided.
     *          | {name: '12hour', format?: 'h:mma'}
     *          | {name: '24hour', format?: 'HH:mm'},
     *     timeZone: 'utc' | 'client',
     * }
     * ```
     */
    DATE_TIME = 'dateTime',
    /**
     * A telephone number (e.g. (415) 555-9876).
     *
     * **Cell format**
     * ```js
     * string
     * ```
     *
     * **Field options**
     *
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
     * });
     * ```
     *
     * Similarly, you can clear the current cell value by passing an empty array, or
     * remove specific attachments by passing a filtered array of the current cell
     * value.
     *
     * Note: when you pass an existing attachment, you must pass the full attachment
     * object. New attachments only require the `url` property. You can optionally
     * pass the \`filename\` property to give it a readable name.
     *
     * Additionally, the Airtable generated attachment URLs do not currently expire,
     * but this will change in the future. If you want to persist the attachments, we
     * recommend downloading them instead of saving the URL. Before this change is
     * rolled out, we will post a more detailed deprecation timeline.
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
     * Array<
     *     // New attachment format
     *     { url: string, filename?: string} ||
     *     // Pre-existing attachments use cell read format specified above
     *     { ... }
     * >
     * ```
     * For pre-existing attachments, pass the object read from the cell value.
     * You cannot change any properties of pre-existing attachments.
     *
     * **Field options read format**
     * ```js
     * {
     *     // Whether attachments are rendered in the reverse order from the cell value in the
     *     // Airtable UI (i.e. most recent first)
     *     // You generally do not need to rely on this option.
     *     isReversed: boolean,
     * }
     * ```
     *
     * **Field options write format**
     *
     * N/A
     *
     * Options are not required when creating a `MULTIPLE_ATTACHMENTS` field, and updating options
     * is not supported.
     */
    MULTIPLE_ATTACHMENTS = 'multipleAttachments',
    /**
     * A checkbox.
     *
     * This field is "true" when checked and "null" when unchecked.
     *
     * **Cell read format**
     * ```js
     * true | null
     * ```
     *
     * You can write to the cell with "false", but the read value will be still be "null"
     * (unchecked).
     *
     * **Cell write format**
     * ```js
     * boolean | null
     * ```
     *
     * **Field options**
     *
     * ```js
     * {
     *     // an icon name
     *     icon: 'check' | 'star' | 'heart' | 'thumbsUp' | 'flag',
     *     // the color of the check box
     *     color: 'yellowBright' | 'orangeBright' | 'redBright' | 'pinkBright' | 'purpleBright' | 'blueBright' | 'cyanBright' | 'tealBright' | 'greenBright' | 'grayBright' ,
     * }
     * ```
     *
     * Bases on a free or plus plan are limited to using the 'check' icon and 'greenBright' color.
     */
    CHECKBOX = 'checkbox',
    /**
     * Compute a value in each record based on other fields in the same record.
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
     * **Field options read format**
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
     * **Field options write format**
     *
     * Creating or updating `FORMULA` fields is not supported.
     */
    FORMULA = 'formula',
    /**
     * The time the record was created in UTC.
     *
     * When reading from a "Created time" field, the cell value will always be an
     * [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time.
     * (Field options specify how it's displayed in the UI.)
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
     * **Field options read format**
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
     * **Field options write format**
     *
     * Creating or updating `CREATED_TIME` fields is not supported.
     */
    CREATED_TIME = 'createdTime',
    /**
     * A rollup allows you to summarize data from records that are linked to this table.
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
     * **Field options read format**
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
     * **Field options write format**
     *
     * Creating or updating `ROLLUP` fields is not supported.
     */
    ROLLUP = 'rollup',
    /**
     * Count the number of linked records.
     *
     * **Cell read format**
     * ```js
     * number
     * ```
     *
     * **Cell write format**
     *
     * n/a
     *
     * **Field options read format**
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
     * **Field options write format**
     *
     * Creating or updating `COUNT` fields is not supported.
     */
    COUNT = 'count',
    /**
     * Lookup a field on linked records.
     *
     * **Cell read format**
     * ```js
     * Array<{
     *     // the ID of the linked record this lookup value comes from
     *     linkedRecordId: RecordId,
     *     // the cell value of the lookup. the actual type depends on the field being looked up
     *     value: unknown,
     * }>
     * ```
     *
     * **Cell write format**
     *
     * n/a
     *
     * **Field options read format**
     * ```js
     * {
     *     // whether the lookup field is correctly configured
     *     isValid: boolean,
     *     // the linked record field in this table that this field is
     *     // looking up
     *     recordLinkFieldId: FieldId,
     *     // the field in the foreign table that will be looked up on
     *     // each linked record
     *     fieldIdInLinkedTable: FieldId | null,
     *     // the local field configuration for the foreign field being
     *     // looked up
     *     result?: undefined | {type: FieldType, options: unknown}
     * }
     * ```
     *
     * **Field options write format**
     *
     * Creating or updating `MULTIPLE_LOOKUP_VALUES` fields is not supported.
     */
    MULTIPLE_LOOKUP_VALUES = 'multipleLookupValues',
    /**
     * Automatically incremented unique counter for each record.
     *
     * **Cell read format**
     * ```js
     * number
     * ```
     *
     * **Cell write format**
     *
     * n/a
     *
     * **Field options read format**
     *
     * n/a
     *
     * **Field options write format**
     *
     * Creating or updating `AUTO_NUMBER` fields is not supported.
     */
    AUTO_NUMBER = 'autoNumber',
    /**
     * Use the Airtable iOS or Android app to scan barcodes.
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
     *
     * **Field options**
     *
     * n/a
     */
    BARCODE = 'barcode',
    /**
     * A rating (e.g. stars out of 5)
     *
     * **Cell format**
     * ```js
     * number
     * ```
     *
     * **Field options**
     * ```js
     * {
     *     // the icon name used to display the rating
     *     icon: 'star' | 'heart' | 'thumbsUp' | 'flag',
     *     // the maximum value for the rating, from 1 to 10 inclusive
     *     max: number,
     *     // the color of selected icons
     *     color: 'yellowBright' | 'orangeBright' | 'redBright' | 'pinkBright' | 'purpleBright' | 'blueBright' | 'cyanBright' | 'tealBright' | 'greenBright' | 'grayBright' ,
     * }
     * ```
     *
     * Bases on a free or plus plan are limited to using the 'star' icon and 'yellowBright' color.
     */
    RATING = 'rating',
    /**
     * A long text field with rich formatting enabled.
     *
     * Returned string is formatted with [markdown syntax for Airtable rich text formatting](https://support.airtable.com/hc/en-us/articles/360044741993-Markdown-syntax-for-Airtable-rich-text-formatting).
     * Use this formatting when updating cell values.
     *
     * **Cell format**
     * ```js
     * string
     * ```
     * **Field options**
     *
     * n/a
     *
     */
    RICH_TEXT = 'richText',
    /**
     * A duration of time in seconds.
     *
     * The `durationFormat` string follows the moment.js structure documented
     * [here](https://momentjs.com/docs/#/parsing/string-format/).
     *
     * **Cell format**
     * ```js
     * number
     * ```
     *
     * **Field options**
     * ```js
     * {
     *     durationFormat: 'h:mm' | 'h:mm:ss' | 'h:mm:ss.S' | 'h:mm:ss.SS' | 'h:mm:ss.SSS',
     * }
     * ```
     */
    DURATION = 'duration',
    /**
     * Shows the date and time that a record was most recently modified in any editable field or
     * just in specific editable fields.
     *
     * When reading from a "Last modified time" field, the cell value will always be an
     * [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time.
     * (Field options specify how it's displayed in the UI.)
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
     * **Field options read format**
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
     * **Field options write format**
     *
     * Creating or updating `LAST_MODIFIED_TIME` fields is not supported.
     */
    LAST_MODIFIED_TIME = 'lastModifiedTime',
    /**
     * The collaborator who created a record.
     *
     * The cell value format is the same as the `SINGLE_COLLABORATOR` field, without the ability to
     * write to the cell value.
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
     *
     * **Cell write format**
     *
     * n/a
     *
     * **Field options read format**
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
     * **Field options write format**
     *
     * Creating or updating `CREATED_BY` fields is not supported.
     *
     */
    CREATED_BY = 'createdBy',
    /**
     * Shows the last collaborator who most recently modified any editable field or just in specific
     * editable fields.
     *
     * The cell value format is the same as the `SINGLE_COLLABORATOR` field, without the ability to
     * write to the cell value.
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
     *
     * **Cell write format**
     *
     * n/a
     *
     * **Field options read format**
     * ```js
     * {
     *     referencedFieldIds: Array<FieldId>,
     *     choices: Array<{
     *         id: string,
     *         email: string,
     *         name?: string,
     *         profilePicUrl?: string,
     *     }>,
     * }
     * ```
     *
     * **Field options write format**
     *
     * Creating or updating `LAST_MODIFIED_BY` fields is not supported.
     *
     */
    LAST_MODIFIED_BY = 'lastModifiedBy',
    /**
     * A button that can be clicked from the Airtable UI to open a URL or open a block.
     *
     * You cannot currently programmatically interact with a button field from a block, but you can
     * configure your block to perform a certain action when it's opened from a button field: see
     * {@link useRecordActionData} for details.
     *
     * **Cell read format**
     * ```js
     * {
     *     // The label of the button
     *     label: string,
     *     // URL the button opens, or URL of the block that the button opens.
     *     // Null when the URL formula has become invalid.
     *     url: string | null,
     * }
     * ```
     *
     * **Cell write format**
     *
     * n/a
     *
     * **Field options read format**
     *
     * n/a
     *
     * **Field options write format**
     *
     * Creating or updating `BUTTON` fields is not supported.
     *
     */
    BUTTON = 'button',
    /**
     * Shows the name of the source that a record is synced from. This field is only available on
     * synced tables.
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
     *
     * n/a
     *
     * **Field options read format**
     * ```js
     * {
     *     choices: Array<{
     *         id: string,
     *         name: string,
     *         color?: {@link Color}, // Color is not provided when field coloring is disabled.
     *     }>,
     * }
     * ```
     * Every choice represents a sync source, and choices are added or removed automatically as
     * sync sources are added or removed. Choice names and colors are user-configurable.
     *
     * **Field options write format**
     *
     * Creating or updating `EXTERNAL_SYNC_SOURCE` fields is not supported.
     *
     */
    EXTERNAL_SYNC_SOURCE = 'externalSyncSource',
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
    isSynced: boolean | null;
}

/** @hidden */
export interface FieldPermissionData {
    readonly id: FieldId;
    readonly name: string;
    readonly type: PrivateColumnType;
    readonly lock: FieldLock | null;
}

/** @hidden */
export interface FieldOptions {
    [key: string]: unknown;
}

/** @hidden */
interface NumericFieldOptions {
    precision: number;
}

/** @hidden */
interface CurrencyFieldOptions extends NumericFieldOptions {
    symbol: string;
}

/** @hidden */
interface SelectFieldOptions {
    choices: Array<{
        id: string;
        name: string;
        color?: Color;
    }>;
}

/** @hidden */
interface CollaboratorFieldOptions {
    choices: Array<{
        id: string;
        email: string;
        name?: string;
        profilePicUrl?: string;
    }>;
}

/** @hidden */
interface LinkedRecordFieldOptions {
    linkedTableId: TableId;
    inverseLinkFieldId?: FieldId;
    viewIdForRecordSelection?: ViewId;
    isReversed: boolean;
    prefersSingleRecordLink: boolean;
}

/** @hidden */
interface DateFieldOptions {
    dateFormat:
        | {name: 'local'; format: 'l'}
        | {name: 'friendly'; format: 'LL'}
        | {name: 'us'; format: 'M/D/YYYY'}
        | {name: 'european'; format: 'D/M/YYYY'}
        | {name: 'iso'; format: 'YYYY-MM-DD'};
}

/** @hidden */
interface DateTimeFieldOptions extends DateFieldOptions {
    timeFormat: {name: '12hour'; format: 'h:mma'} | {name: '24hour'; format: 'HH:mm'};
    timeZone: 'utc' | 'client';
}

/** @hidden */
interface AttachmentsFieldOptions {
    isReversed: boolean;
}

/** @hidden */
interface CheckboxFieldOptions {
    icon: 'check' | 'star' | 'heart' | 'thumbsUp' | 'flag';
    color:
        | 'yellowBright'
        | 'orangeBright'
        | 'redBright'
        | 'pinkBright'
        | 'purpleBright'
        | 'blueBright'
        | 'cyanBright'
        | 'tealBright'
        | 'greenBright'
        | 'grayBright';
}

/** @hidden */
interface FormulaFieldOptions {
    isValid: boolean;
    referencedFieldIds: Array<FieldId>;
    result: FieldConfig;
}

/** @hidden */
interface CreatedTimeFieldOptions {
    result: DateFieldConfig | DateTimeFieldConfig;
}

/** @hidden */
interface RollupFieldOptions extends FormulaFieldOptions {
    recordLinkFieldId: FieldId;
    fieldIdInLinkedTable: FieldId;
}

/** @hidden */
interface CountFieldOptions {
    isValid: boolean;
    recordLinkFieldId: FieldId;
}

/** @hidden */
type LookupFieldOptions =
    | {
          isValid: true;
          recordLinkFieldId: FieldId;
          fieldIdInLinkedTable: FieldId | null;
          result: FieldConfig;
      }
    | {
          isValid: false;
          recordLinkFieldId: FieldId;
          fieldIdInLinkedTable: FieldId | null;
          result: undefined;
      };

/** @hidden */
interface RatingFieldOptions {
    icon: 'star' | 'heart' | 'thumbsUp' | 'flag';
    max: number;
    color:
        | 'yellowBright'
        | 'orangeBright'
        | 'redBright'
        | 'pinkBright'
        | 'purpleBright'
        | 'blueBright'
        | 'cyanBright'
        | 'tealBright'
        | 'greenBright'
        | 'grayBright';
}

/** @hidden */
interface DurationFieldOptions {
    durationFormat: 'h:mm' | 'h:mm:ss' | 'h:mm:ss.S' | 'h:mm:ss.SS' | 'h:mm:ss.SSS';
}

/** @hidden */
interface LastModifiedTimeFieldOptions {
    isValid: boolean;
    referencedFieldIds: Array<FieldId>;
    result: DateFieldConfig | DateTimeFieldConfig;
}

/** @hidden */
interface CreatedByFieldOptions extends CollaboratorFieldOptions {}

/** @hidden */
interface LastModifiedByFieldOptions extends CreatedByFieldOptions {
    referencedFieldIds: Array<FieldId>;
}

/** @hidden */
interface ExternalSyncSourceFieldOptions extends SelectFieldOptions {}

/** @hidden */
interface OptionlessFieldConfig {
    type:
        | FieldType.SINGLE_LINE_TEXT
        | FieldType.EMAIL
        | FieldType.URL
        | FieldType.MULTILINE_TEXT
        | FieldType.PHONE_NUMBER
        | FieldType.AUTO_NUMBER
        | FieldType.BARCODE
        | FieldType.RICH_TEXT
        | FieldType.BUTTON;
    options: null;
}

/** @hidden */
interface NumericFieldConfig {
    type: FieldType.NUMBER | FieldType.PERCENT;
    options: NumericFieldOptions;
}

/** @hidden */
interface CurrencyFieldConfig {
    type: FieldType.CURRENCY;
    options: CurrencyFieldOptions;
}

/** @hidden */
interface SelectFieldConfig {
    type: FieldType.SINGLE_SELECT | FieldType.MULTIPLE_SELECTS;
    options: SelectFieldOptions;
}

/** @hidden */
interface CollaboratorFieldConfig {
    type: FieldType.SINGLE_COLLABORATOR | FieldType.MULTIPLE_COLLABORATORS | FieldType.CREATED_BY;
    options: CollaboratorFieldOptions;
}

/** @hidden */
interface LinkedRecordFieldConfig {
    type: FieldType.MULTIPLE_RECORD_LINKS;
    options: LinkedRecordFieldOptions;
}

/** @hidden */
interface DateFieldConfig {
    type: FieldType.DATE;
    options: DateFieldOptions;
}

/** @hidden */
interface DateTimeFieldConfig {
    type: FieldType.DATE_TIME;
    options: DateTimeFieldOptions;
}

/** @hidden */
interface AttachmentsFieldConfig {
    type: FieldType.MULTIPLE_ATTACHMENTS;
    options: AttachmentsFieldOptions;
}

/** @hidden */
interface CheckboxFieldConfig {
    type: FieldType.CHECKBOX;
    options: CheckboxFieldOptions;
}

/** @hidden */
interface FormulaFieldConfig {
    type: FieldType.FORMULA;
    options: FormulaFieldOptions;
}

/** @hidden */
interface CreatedTimeFieldConfig {
    type: FieldType.CREATED_TIME;
    options: CreatedTimeFieldOptions;
}

/** @hidden */
interface RollupFieldConfig {
    type: FieldType.ROLLUP;
    options: RollupFieldOptions;
}

/** @hidden */
interface CountFieldConfig {
    type: FieldType.COUNT;
    options: CountFieldOptions;
}

/** @hidden */
interface LookupFieldConfig {
    type: FieldType.MULTIPLE_LOOKUP_VALUES;
    options: LookupFieldOptions;
}

/** @hidden */
interface RatingFieldConfig {
    type: FieldType.RATING;
    options: RatingFieldOptions;
}

/** @hidden */
interface DurationFieldConfig {
    type: FieldType.DURATION;
    options: DurationFieldOptions;
}

/** @hidden */
interface LastModifiedTimeFieldConfig {
    type: FieldType.LAST_MODIFIED_TIME;
    options: LastModifiedTimeFieldOptions;
}

/** @hidden */
interface CreatedByFieldConfig {
    type: FieldType.CREATED_BY;
    options: CreatedByFieldOptions;
}

/** @hidden */
interface LastModifiedByFieldConfig {
    type: FieldType.LAST_MODIFIED_BY;
    options: LastModifiedByFieldOptions;
}

/** @hidden */
interface ExternalSyncSourceFieldConfig {
    type: FieldType.EXTERNAL_SYNC_SOURCE;
    options: ExternalSyncSourceFieldOptions;
}

/**
 * A type for use with Field objects to make type narrowing FieldOptions easier.
 *
 * @example
 * const fieldConfig = field.config;
 * if (fieldConfig.type === FieldType.SINGLE_SELECT) {
 *     return fieldConfig.options.choices;
 * } else if (fieldConfig.type === FieldType.MULTIPLE_LOOKUP_VALUES && fieldConfig.options.isValid) {
 *     if (fieldConfig.options.result.type === FieldType.SINGLE_SELECT) {
 *         return fieldConfig.options.result.options.choices;
 *     }
 * }
 * return DEFAULT_CHOICES;
 */
export type FieldConfig =
    | OptionlessFieldConfig
    | NumericFieldConfig
    | CurrencyFieldConfig
    | SelectFieldConfig
    | CollaboratorFieldConfig
    | LinkedRecordFieldConfig
    | DateFieldConfig
    | DateTimeFieldConfig
    | AttachmentsFieldConfig
    | CheckboxFieldConfig
    | FormulaFieldConfig
    | CreatedTimeFieldConfig
    | RollupFieldConfig
    | CountFieldConfig
    | LookupFieldConfig
    | RatingFieldConfig
    | DurationFieldConfig
    | LastModifiedTimeFieldConfig
    | CreatedByFieldConfig
    | LastModifiedByFieldConfig
    | ExternalSyncSourceFieldConfig;
