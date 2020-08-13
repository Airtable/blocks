import {FieldType} from '@airtable/blocks/models';

export const AllowedCacheFieldTypes = [FieldType.MULTILINE_TEXT, FieldType.SINGLE_LINE_TEXT];

export const AllowedLocationFieldTypes = [
    FieldType.FORMULA,
    FieldType.MULTILINE_TEXT,
    FieldType.MULTIPLE_LOOKUP_VALUES,
    FieldType.ROLLUP,
    FieldType.SINGLE_LINE_TEXT,
    FieldType.SINGLE_SELECT,
];
