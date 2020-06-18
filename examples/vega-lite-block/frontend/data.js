import React from 'react';
import {FieldType} from '@airtable/blocks/models';
import {Box, Link} from '@airtable/blocks/ui';
import {AllowedTypes} from './types';
import EncodingChannels from './EncodingChannels';
import visitor from './visitor';

/**
 * getUsableCellValue
 * @param  {Record} record An instance of Record
 * @param  {Field}  field  An instance of Field
 * @return {string|number|boolean} A serializable value for the given field in the given record.
 *                                 Cell read formats
 */
export function getUsableCellValue(record, field) {
    const cellValue = record.getCellValue(field);

    // If the cell read format is not a string or number...
    if (typeof cellValue === 'object' && cellValue !== null) {
        return record.getCellValueAsString(field);
    }

    // For checkboxes, record.getCellValueAsString(field) returns
    // "checked" or "", so we make it something useful here:
    if (field.type === FieldType.CHECKBOX) {
        return record.getCellValueAsString(field) ? 'checked' : 'unchecked';
    }

    return cellValue;
}

/**
 * reduceRecords
 * @param  {Table}         table    The selected table
 * @param  {Array<Record>} records  The records array returned by useRecords(model)
 * @return {Array<Object>}          Data from the selected table, to be passed to <VegaLite>
 */
export function reduceRecords(table, records) {
    // There is no table
    if (!table) {
        return [];
    }

    // There are no records to return data from
    if (!records || !records.length) {
        return [];
    }

    // Reduce the fields to a set containing only
    // the allowed fields, by field type
    const fields = table.fields.reduce((accum, field) => {
        if (AllowedTypes.includes(field.type)) {
            accum.push(field);
        }
        return accum;
    }, []);

    // There are no fields that are allowed
    if (!fields.length) {
        return [];
    }

    const entries = [];
    for (const record of records) {
        const entry = {};
        for (const field of fields) {
            entry[field.name] = getUsableCellValue(record, field);
        }
        entries.push(entry);
    }
    return entries;
}

const needle = '"field": "';
// Since these will always be the same, we make them once and reuse as needed
const VEGA_DOCS_URL = 'https://vega.github.io/vega-lite/docs';
const transformNameLink = (
    <Link href={`${VEGA_DOCS_URL}/transform.html`} target="_blank">
        transform name
    </Link>
);
const inlineDataNameLink = (
    <Link href={`${VEGA_DOCS_URL}/data.html#inline`} target="_blank">
        inline data name
    </Link>
);

function FieldDefinitionError({property, encoding, table}) {
    const stringified = JSON.stringify(encoding, null, 2).split('\n');
    // Attempt to find the "field" or "as" name, so we can add an arrow pointer
    const linesOfJSON = stringified.reduce((accum, line) => {
        // First push the line, every time.
        accum.push(line);

        // Next, try to find a matching pattern, so that we can point to
        // the erroneous "field", "as" or "data" name:
        const index = line.indexOf(needle);
        if (index !== -1) {
            const arrowLine = `${'-'.repeat(index + needle.length)}^`;
            accum.push(arrowLine);
        }
        return accum;
    }, []);

    const json = linesOfJSON.join('\n');

    return (
        <Box>
            {encoding.field ? <strong>{encoding.field}</strong> : '(empty)'} is not a valid{' '}
            {transformNameLink}, {inlineDataNameLink}, or field name from the{' '}
            <strong>{table.name}</strong> table:
            <Box backgroundColor="grayLight2" padding={2} marginTop={2} borderRadius="default">
                <pre style={{margin: 0}}>
                    &quot;{property}&quot;: {json}
                </pre>
            </Box>
        </Box>
    );
}

/**
 * validateFieldDefinitions ensures that only real field names
 * from the selected table are used to build charts.
 *
 * @param  {Table} table          The selected table
 * @param  {Object} specification A parsed vega-lite specification JSON string
 * @return {Array}                An array of errors. Should only ever have one entry.
 */
export function validateFieldDefinitions(table, specification) {
    const errors = [];

    if (!table) {
        return errors;
    }

    // Produce a list of all of the "real" table field names
    const fieldNames = table.fields.map(({name}) => name);

    // Collect a list of the "inline data" field name values, which
    // must be treated the same as "real" field names
    const foundInlineNames = [];
    //
    // Collect a list of the "as" field name values, which
    // must be treated the same as "real" field names. These will
    // be present in transform definitions.
    const asNames = [];
    visitor(specification, (object, property, value) => {
        if (property === 'data') {
            const {values} = value || {};
            if (Array.isArray(values) && values.length) {
                foundInlineNames.push(
                    ...values.reduce((accum, value) => {
                        if (typeof value === 'object') {
                            accum.push(...Object.keys(value));
                        }
                        return accum;
                    }, []),
                );
            }
            // From https://vega.github.io/vega-lite/docs/data.html#inline:
            //
            // If the input data is simply an array of primitive values, each
            // value is mapped to the data property of a new object. For
            // example [5, 3, 8, 1] is loaded as:
            //
            // [{"data": 5}, {"data": 3}, {"data": 8}, {"data": 1}]
            //
            // However, the "data" property may have already been found,
            // since the inline data itself could look like:
            //
            // [{"data": 5}, {"data": 3}, {"data": 8}, {"data": 1}]
            //
            // Check to see if it's there, and if not, add it.
            if (foundInlineNames.length && !foundInlineNames.includes('data')) {
                foundInlineNames.push('data');
            }
        }

        // "as" names are the names of fields produced by some kind
        // of operation. These are present in the following:
        //
        // Calculate Transform
        //      as  String  Required.
        //          The field for storing the computed formula value.
        //
        // Density Transform Definitions
        //      as  [FieldName, FieldName]
        //          The output fields for the sample value and corresponding density estimate.
        //          Default value: ["value", "density"]
        //
        // Flatten Transform Definition
        //      as  String[]
        //          The output field names for extracted array values.
        //          Default value: The field name of the corresponding array field
        //
        // Fold Transform Definition
        //      as  [FieldName, FieldName]
        //          The output field names for the key and value properties
        //          produced by the fold transform.
        //          Default value: ["key", "value"]
        //
        // Join Aggregate Transform Field Definition
        //      as  String
        //          Required. The output name for the join aggregate operation.
        //
        // Loess Transform Definition
        //      as  [FieldName, FieldName]
        //          The output field names for the smoothed points generated by the loess transform.
        //          Default value: The field names of the input x and y values.
        //
        // Lookup Transform
        //      as  String | String[]
        //      The output fields on which to store the looked up data values.
        //
        // Regression Transform Definition
        //      as  [FieldName, FieldName]
        //      The output field names for the smoothed points generated by
        //      the regression transform.
        //      Default value: The field names of the input x and y values.
        //
        // Time Unit Transform
        //      as  String
        //      Required. The output field to write the timeUnit value.
        //
        // Window Transform Field Definition
        //      as  String  Required.
        //          The output name for the window operation.
        //
        if (property === 'as') {
            asNames.push(...(typeof value === 'string' ? [value] : value));
        }
    });

    // Make unique list of found inline names
    const inlineNames = [...new Set(foundInlineNames)];

    // Merge all derived and conjured property names
    const validNames = [...fieldNames, ...inlineNames, ...asNames];

    // By the time this is called, the editor itself has not
    // found any errors while validating the specification
    // based on the schema. This operation will check for conditions
    // that this block considers an error, ie. bogus field names.
    if (specification && typeof specification === 'object') {
        visitor(specification, (object, property, value) => {
            // The value of a "field" property is not strictly
            // a table field name, eg. `"field": {"repeat": "column"}`
            if (
                EncodingChannels.includes(property) &&
                typeof value === 'object' &&
                value !== null &&
                typeof value.field === 'string'
            ) {
                if (!validNames.includes(value.field)) {
                    errors.push(
                        <FieldDefinitionError property={property} encoding={value} table={table} />,
                    );
                    return;
                }
            }
        });
    }

    return errors;
}
