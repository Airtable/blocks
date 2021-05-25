import {FieldType} from '@airtable/blocks/models';

// These are the Airtable FieldTypes that are allowed
// as data sources in the derived data that is passed
// to <VegaLite data={data} ... />
export const AllowedTypes = [
    FieldType.AUTO_NUMBER,
    FieldType.BARCODE,
    FieldType.CHECKBOX,
    FieldType.COUNT,
    FieldType.CREATED_BY,
    FieldType.CREATED_TIME,
    FieldType.CURRENCY,
    FieldType.DATE,
    FieldType.DATE_TIME,
    FieldType.DURATION,
    FieldType.EMAIL,
    FieldType.FORMULA,
    FieldType.LAST_MODIFIED_BY,
    FieldType.LAST_MODIFIED_TIME,
    FieldType.MULTILINE_TEXT,
    FieldType.MULTIPLE_COLLABORATORS,
    FieldType.MULTIPLE_LOOKUP_VALUES,
    FieldType.MULTIPLE_RECORD_LINKS,
    FieldType.MULTIPLE_SELECTS,
    FieldType.NUMBER,
    FieldType.PERCENT,
    FieldType.PHONE_NUMBER,
    FieldType.RATING,
    FieldType.ROLLUP,
    FieldType.SINGLE_COLLABORATOR,
    FieldType.SINGLE_LINE_TEXT,
    FieldType.SINGLE_SELECT,
    FieldType.URL,
    FieldType.EXTERNAL_SYNC_SOURCE,
];

// Order matters here!
//
// This is the preferred order of fields to look for when finding
// an initial field to inject into the X nominal type axis, displayed
// when the user first installs the app.
export const InitialNominalFieldTypes = [
    FieldType.SINGLE_SELECT,
    FieldType.SINGLE_COLLABORATOR,
    FieldType.CHECKBOX,
];

// These are used by the editor to automattically set
// the correct Vega Type, based on the Airtable type,
// when a given field is accepted as a completion.
export const VegaTypes = {
    [FieldType.AUTO_NUMBER]: 'ordinal',
    [FieldType.BARCODE]: 'nominal',
    [FieldType.CHECKBOX]: 'nominal',
    [FieldType.COUNT]: 'quantitative',
    [FieldType.CREATED_BY]: 'nominal',
    [FieldType.CREATED_TIME]: 'temporal',
    [FieldType.CURRENCY]: 'quantitative',
    [FieldType.DATE]: 'temporal',
    [FieldType.DATE_TIME]: 'temporal',
    [FieldType.DURATION]: 'temporal',
    [FieldType.EMAIL]: 'nominal',
    [FieldType.FORMULA]: 'nominal',
    [FieldType.LAST_MODIFIED_BY]: 'nominal',
    [FieldType.LAST_MODIFIED_TIME]: 'temporal',
    [FieldType.MULTILINE_TEXT]: 'nominal',
    [FieldType.MULTIPLE_COLLABORATORS]: 'nominal',
    [FieldType.MULTIPLE_LOOKUP_VALUES]: 'nominal',
    [FieldType.MULTIPLE_RECORD_LINKS]: 'nominal',
    [FieldType.MULTIPLE_SELECTS]: 'nominal',
    [FieldType.NUMBER]: 'quantitative',
    [FieldType.PERCENT]: 'quantitative',
    [FieldType.PHONE_NUMBER]: 'nominal',
    [FieldType.RATING]: 'quantitative',
    [FieldType.ROLLUP]: 'nominal',
    [FieldType.SINGLE_COLLABORATOR]: 'nominal',
    [FieldType.SINGLE_LINE_TEXT]: 'nominal',
    [FieldType.SINGLE_SELECT]: 'nominal',
    [FieldType.URL]: 'nominal',
    [FieldType.EXTERNAL_SYNC_SOURCE]: 'nominal',
};
