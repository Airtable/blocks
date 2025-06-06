/** @module @airtable/blocks/ui: Label */ /** */
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import useStyledSystem from './use_styled_system';
import {allStylesPropTypes, AllStylesProps} from './system/index';
import {ariaPropTypes, AriaProps} from './types/aria_props';
import {TextSize, textSizePropType, TextSizeProp, useTextStyle} from './text';
import {dataAttributesPropType, DataAttributesProp} from './types/data_attributes_prop';

/**
 * Props for the {@link Label} component. Also accepts:
 * * {@link AllStylesProps}
 * * {@link AriaProps}
 *
 * @noInheritDoc
 * @docsPath UI/components/Label
 */
export interface LabelProps extends AllStylesProps, AriaProps {
    /** The size of the label. Defaults to `default`. Can be a responsive prop object. */
    size?: TextSizeProp;
    /** The `for` attribute. Should contain the `id` of the input. */
    htmlFor?: string;
    /** The `id` attribute. */
    id?: string;
    /** The contents of the label. */
    children?: React.ReactNode | string;
    /** Additional class names to apply, separated by spaces. */
    className?: string;
    /** Additional styles. */
    style?: React.CSSProperties;
    /** Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`. */
    dataAttributes?: DataAttributesProp;
    /** The `role` attribute. */
    role?: string;
}

/**
 * A label component.
 *
 * [[ Story id="label--example" title="Label example" ]]
 *
 * @docsPath UI/components/Label
 * @component
 */
const Label = (props: LabelProps, ref: React.Ref<HTMLLabelElement>) => {
    const {
        size = TextSize.default,
        htmlFor,
        id,
        children,
        className,
        style,
        dataAttributes,
        role,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'aria-controls': ariaControls,
        'aria-expanded': ariaExpanded,
        'aria-haspopup': ariaHasPopup,
        'aria-hidden': ariaHidden,
        'aria-live': ariaLive,
        ...styleProps
    } = props;

    const classNameForTextStyle = useTextStyle(size);
    const classNameForStyleProps = useStyledSystem({
        display: 'inline-block',
        textColor: 'light',
        fontWeight: 'strong',
        marginBottom: '6px',
        ...styleProps,
    });

    return (
        <label
            ref={ref}
            htmlFor={htmlFor}
            id={id}
            className={cx(classNameForTextStyle, classNameForStyleProps, className)}
            style={style}
            role={role}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-controls={ariaControls}
            aria-expanded={ariaExpanded}
            aria-haspopup={ariaHasPopup}
            aria-hidden={ariaHidden}
            aria-live={ariaLive}
            {...dataAttributes}
        >
            {children}
        </label>
    );
};

const ForwardedRefLabel = React.forwardRef<HTMLLabelElement, LabelProps>(Label);

ForwardedRefLabel.propTypes = {
    size: textSizePropType,
    htmlFor: PropTypes.string,
    id: PropTypes.string,
    dataAttributes: dataAttributesPropType,
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    ...allStylesPropTypes,
    ...ariaPropTypes,
};

ForwardedRefLabel.displayName = 'Label';

export default ForwardedRefLabel;
