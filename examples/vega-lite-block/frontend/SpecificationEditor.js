import React from 'react';
import {Box} from '@airtable/blocks/ui';
import MonacoEditor from './MonacoEditor';
import {schemas} from './Specification';
import {AllowedTypes, VegaTypes} from './types';
import visitor from './visitor';
/**
 * SpecificationEditor  Create a vega-lite specification JSON editor.
 * @param {object} props {errors, height, width, setErrors, validatedSettings}
 */
function SpecificationEditor(props) {
    const {errors, height, width, setErrors, validatedSettings} = props;
    const {
        hasPermissionToSet,
        setSpecification,
        settings: {specification, tableId, table},
    } = validatedSettings;

    // <MonacoEditor> props
    const key = `specification-editor-${tableId}`;
    const completions = table.fields.reduce((accum, field) => {
        if (AllowedTypes.includes(field.type)) {
            accum.push({
                // fieldName & fieldType belong to us and are
                // used to make suggested encoding types for
                // field definitions.
                fieldName: field.name,
                fieldType: field.type,
                // insertText, label & command belong to Monaco
                // and are used for displaying an autocomplete list
                insertText: `${field.name}`,
                label: `"${field.name}"`,
            });
        }
        return accum;
    }, []);
    const onCompletion = ({fieldName, fieldType}, specification) => {
        try {
            // If this spec is valid and parsable, then
            // we can do something useful with it...
            const spec = JSON.parse(specification);
            /*
                1. Check all EncodingChannels for values that match fieldName
                2. Set adjacent "type" field value to VegaTypes[fieldType]
            */
            visitor(spec, (object, key, value) => {
                if (key === 'field' && value === fieldName) {
                    object.type = VegaTypes[fieldType];
                    setSpecification(JSON.stringify(spec, null, 2));
                    return true;
                }
            });
        } catch (error) {
            // Errors are managed directly by MonacoEditor
            // and surfaced through onSyntaxError. Since we
            // also allow invalid specification syntax, these
            // errors must be supressed.
            // Because we cannot have an empty app here, we must
            // do something to appease to the lint gods.
            void error;
        }
    };
    const onChange = (_, value) => {
        setSpecification(value);
    };
    const onSyntaxError = newErrors => {
        if (
            // There are new errors to report
            newErrors.length ||
            // Or, there are previously errors and now there are none.
            (errors.length && !newErrors.length)
        ) {
            setErrors(newErrors);
        }
    };
    const readOnly = !hasPermissionToSet;
    // </MonacoEditor> props

    return (
        <Box display="flex" height="100%" margin={0} overflow="hidden" padding={0}>
            {table ? (
                <MonacoEditor
                    key={key}
                    onChange={onChange}
                    onCompletion={onCompletion}
                    onSyntaxError={onSyntaxError}
                    schemas={schemas}
                    readOnly={readOnly}
                    completions={completions}
                    width={width}
                    height={height}
                    value={specification}
                />
            ) : null}
        </Box>
    );
}

export default SpecificationEditor;
