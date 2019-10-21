/** @module @airtable/blocks/ui: Label */ /** */
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import useStyledSystem from './use_styled_system';
import {allStylesPropTypes, AllStylesProps} from './system/index';
import {ariaPropTypes, AriaProps} from './types/aria_props';
import {TextSize, textSizePropType, TextSizeProp, useTextStyle} from './text';
import {dataAttributesPropType, DataAttributesProp} from './types/data_attributes';

/**
 * @typedef {object} LabelProps
 * @property {'small' | 'default' | 'large' | 'xlarge'} [size='default'] The `size` of the label. Defaults to `default`. Can be a responsive prop object.
 * @property {string} [htmlFor] The `for` attribute. Should contain the `id` of the input.
 * @property {string} [role] The `role` attribute.
 * @property {string} [className] Additional class names to apply, separated by spaces.
 * @property {object} [style] Additional styles.
 * @property {object} [dataAttributes] Data attributes that are spread onto the element `dataAttributes={{'data-*': '...'}}`.
 * @property {string} [aria-label] The `aria-label` attribute.
 * @property {string} [aria-labelledby] The `aria-labelledby` attribute. A space separated list of label element IDs.
 * @property {string} [aria-describedby] The `aria-describedby` attribute. A space separated list of description element IDs.
 * @property {string} [aria-controls] The `aria-controls` attribute.
 * @property {string} [aria-expanded] The `aria-expanded` attribute.
 * @property {string} [aria-haspopup] The `aria-haspopup` attribute.
 * @property {string} [aria-hidden] The `aria-hidden` attribute.
 * @property {string} [aria-live] The `aria-live` attribute.
 */
interface LabelProps extends AriaProps, AllStylesProps {
    size?: TextSizeProp;
    htmlFor?: string;
    id?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    dataAttributes?: DataAttributesProp;
    role?: string;
}

/**
 * A label component.
 *
 * ```js
 * import {Label, Input} from '@airtable/blocks/ui';
 * import React, {Fragment} from 'react';
 *
 * function LabelExample() {
 *     return (
 *       <Fragment>
 *           <Label htmlFor="my-input">Label</Label>
 *           <Input id="my-input" onChange={() => {}} value="" />
 *       </Fragment>
 *     );
 * }
 * ```
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    (
        {
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
        }: LabelProps,
        ref: React.Ref<HTMLLabelElement>,
    ) => {
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
    },
);

Label.propTypes = {
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

export default Label;
