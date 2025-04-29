/** @module @airtable/blocks/ui: FormField */ /** */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import {compose} from '@styled-system/core';
import {getLocallyUniqueId} from '../../shared/private_utils';
import Box from './box';
import Text, {TextSize} from './text';
import Label from './label';
import {FormFieldContext} from './use_form_field';
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

/**
 * Style props for the {@link FormField} component. Accepts:
 * * {@link FlexItemSetProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link SpacingSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
interface FormFieldStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        SpacingSetProps {}

const styleParser = compose(maxWidth, minWidth, width, flexItemSet, positionSet, spacingSet);

export const formFieldStylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...spacingSetPropTypes,
};

/**
 * Props for the {@link FormField} component. Also accepts:
 * * {@link FormFieldStyleProps}
 *
 * @noInheritDoc
 * @docsPath UI/components/FormField
 */
export interface FormFieldProps extends FormFieldStyleProps {
    /** The `id` attribute. */
    id?: string;
    /** Additional class names to apply to the form field. */
    className?: string;
    /** Additional styles to apply to the form field. */
    style?: React.CSSProperties;
    /** The label content for the form field. */
    label?: React.ReactNode;
    /** The `for` attribute to be applied to the inner label. By default, the form field will automatically generate a random ID and set it on both the label and the wrapped input/select. Only use this property if you want to override the generated ID with your own custom ID. */
    htmlFor?: string;
    /** The description content for the form field. Displayed beneath the label and above the wrapped control field. */
    description?: React.ReactNode | string | null;
    /** The contents of the form field. */
    children?: React.ReactNode;
}

/**
 * A form field component that wraps any control field, supplying a provided label and optional
 * description.
 *
 * [[ Story id="formfield--example" title="Form field example" ]]
 *
 * This component will automatically set up the `for` attribute on the outputted label with the `id` attribute
 * on the wrapped control field for the following UI components: Label, Select, FieldPicker,
 * ModelPicker, and ViewPicker. If you'd like to manually override this behavior, you can provide an
 * `htmlFor` prop to this component and manually set the `id` attribute on your wrapped control to
 * the same value.
 *
 * @docsPath UI/components/FormField
 * @component
 */
const FormField = (props: FormFieldProps, ref: React.Ref<HTMLDivElement>) => {
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
    const classNameForStyleProps = useStyledSystem({width: '100%', ...styleProps}, styleParser);
    const [generatedId] = useState(getLocallyUniqueId('form-field-'));
    const controlId = htmlFor || generatedId;
    const [generatedDescriptionId] = useState(getLocallyUniqueId('input-description-'));
    const descriptionId = description ? generatedDescriptionId : '';

    let optionalLabelProps;
    if (description) {
        optionalLabelProps = {marginBottom: 1};
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
                <Text
                    variant="paragraph"
                    id={descriptionId}
                    size="default"
                    textColor="light"
                    marginBottom="6px"
                >
                    {description}
                </Text>
            )}
            <FormFieldContext.Provider value={{controlId, descriptionId}}>
                {children}
            </FormFieldContext.Provider>
        </Box>
    );
};

const ForwardedRefFormField = React.forwardRef<HTMLDivElement, FormFieldProps>(FormField);

ForwardedRefFormField.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    label: PropTypes.node,
    htmlFor: PropTypes.string,
    description: PropTypes.node,
    children: PropTypes.node,
    ...formFieldStylePropTypes,
};

ForwardedRefFormField.displayName = 'FormField';

export default ForwardedRefFormField;
