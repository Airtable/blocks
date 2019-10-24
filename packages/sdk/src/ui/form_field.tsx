/** @module @airtable/blocks/ui: FormField */ /** */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import {compose} from '@styled-system/core';
import {getLocallyUniqueId} from '../private_utils';
import Box from './box';
import Text, {TextSize} from './text';
import Label from './label';
import {FormFieldIdContext} from './use_form_field_id';
import useStyledSystem from './use_styled_system';
import {
    maxWidth,
    maxWidthPropTypes,
    MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    MinWidthProps,
    width,
    widthPropTypes,
    WidthProps,
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    spacingSet,
    spacingSetPropTypes,
    SpacingSetProps,
} from './system';

interface StyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        SpacingSetProps {}

const styleParser = compose(
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    spacingSet,
);

const stylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...spacingSetPropTypes,
};

/**
 * @typedef {object} FieldPickerProps
 * @property {string} [id] The `id` attribute.
 * @property {string} [className] Additional class names to apply to the form field.
 * @property {object} [style] Additional styles to apply to the form field.
 * @property {React.ReactNode | string} [label] The label content for the form field.
 * @property {string} [htmlFor] The `for` attribute to be applied to the inner label. By default, the form field will automatically generate a random ID and set it on both the label and the wrapped input/select. Only use this property if you want to override the generated ID with your own custom ID.
 * @property {React.ReactNode | string} [description] The description content for the form field. Displayed beneath the label and above the wrapped control field.
 */
interface FormFieldProps extends StyleProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    label?: React.ReactNode;
    htmlFor?: string;
    description?: React.ReactNode | string | null;
    children?: React.ReactNode | string;
}

/**
 * A form field component that wraps any control field, supplying a provided label and optional
 * description.
 *
 * This will automatically set up the `for` attribute on the outputted label with the `id` attribute
 * on the wrapped control field for the following UI components: Label, Select, FieldPicker,
 * ModelPicker, and ViewPicker. If you'd like to manually override this behavior, you can provide an
 * `htmlFor` prop to this component and manually set the `id` attribute on your wrapped control to
 * the same value.
 *
 * @param props
 *
 * @example
 * ```js
 * import {useBase, Box, FormField, ViewPicker, TablePicker} from '@airtable/blocks/ui';
 * import React, {useState} from 'react';
 *
 * function SettingsForm() {
 *     const base = useBase();
 *     const [name, setName] = useState('');
 *     const [table, setTable] = useState(base.tables[0]);
 *     const [view, setView] = useState(null);
 *     return (
 *         <Box display="flex" flexDirection="column" justifyContent="center" width="400px">
 *             <FormField label="Table" description="Select a table from your base">
 *                 <TablePicker table={table} onChange={setTable} />
 *             </FormField>
 *             <FormField label="View" description="Select a view from your table">
 *                  <ViewPicker table={table} view={view} onChange={setView} />
 *             </FormField>
 *         </Box>
 *     );
 * }
 * ```
 */
const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
    (props: FormFieldProps, ref: React.Ref<HTMLDivElement>) => {
        const {
            id,
            className,
            style,
            label = TextSize.default,
            htmlFor,
            description,
            children,
            ...styleProps
        } = props;
        const classNameForStyleProps = useStyledSystem(styleProps, styleParser);
        const [generatedId] = useState(getLocallyUniqueId('form-field-'));
        const controlId = htmlFor || generatedId;

        let optionalLabelProps;
        if (description) {
            optionalLabelProps = {margin: 0};
        }
        return (
            <Box
                ref={ref}
                id={id}
                className={cx(classNameForStyleProps, className)}
                style={style}
                display="flex"
                flexDirection="column"
                marginBottom={3}
            >
                <Label htmlFor={controlId} size="default" {...optionalLabelProps}>
                    {label}
                </Label>
                {description && (
                    <Text variant="paragraph" size="default" textColor="light" marginBottom="6px">
                        {description}
                    </Text>
                )}
                <FormFieldIdContext.Provider value={controlId}>
                    {children}
                </FormFieldIdContext.Provider>
            </Box>
        );
    },
);

FormField.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    label: PropTypes.node,
    htmlFor: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node,
    ...stylePropTypes,
};

export default FormField;
