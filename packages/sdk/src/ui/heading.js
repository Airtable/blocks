// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import {invariant} from '../error_utils';
import {has, values} from '../private_utils';
import useStyledSystem from './use_styled_system';
import {allStylesPropTypes, type AllStylesProps} from './system/index';
import {type ResponsivePropObject} from './system/utils/types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import createResponsivePropType from './system/utils/create_responsive_prop_type';
import useTheme from './theme/use_theme';
import {ariaPropTypes, type AriaProps} from './types/aria_props';

const HeadingSizes = Object.freeze({
    XSMALL: 'xsmall',
    SMALL: 'small',
    DEFAULT: 'default',
    LARGE: 'large',
    XLARGE: 'xlarge',
    XXLARGE: 'xxlarge',
});
type HeadingSize = $Values<typeof HeadingSizes>;
type HeadingSizeProp = ResponsivePropObject<HeadingSize> | HeadingSize;

const HeadingVariants = Object.freeze({
    DEFAULT: 'default',
    CAPS: 'caps',
});
type HeadingVariant = $Values<typeof HeadingVariants>;

/** @private */
function warnIfHeadingSizeOutOfRangeForVariant(
    size: HeadingSize,
    variant: HeadingVariant,
    headingSizesForVariant: {[HeadingSize]: mixed},
): void {
    if (process.env.NODE_ENV === 'development' && !has(headingSizesForVariant, size)) {
        // eslint-disable-next-line
        console.warn(
            `[@airtable/blocks/ui] warning: <Heading variant='${variant}' /> only supports the following values for the size prop: ${Object.keys(
                headingSizesForVariant,
            ).join(', ')}. The component will fall back to the default size.`,
        );
    }
}

/** @private */
function useHeadingSize(
    headingSizeProp: HeadingSizeProp,
    variant: HeadingVariant,
): $Shape<AllStylesProps> {
    const {headingSizesByVariant} = useTheme();
    const headingSizesForVariant = headingSizesByVariant[variant];

    if (typeof headingSizeProp === 'string') {
        warnIfHeadingSizeOutOfRangeForVariant(headingSizeProp, variant, headingSizesForVariant);
        return (
            // flow-expect-error
            headingSizesForVariant[headingSizeProp] || headingSizesForVariant[HeadingSizes.DEFAULT]
        );
    }

    const responsiveSizePropObject = {};
    for (const sizeKey of Object.keys(headingSizeProp)) {
        invariant(headingSizeProp[sizeKey], 'headingSizeProp[sizeKey]');
        warnIfHeadingSizeOutOfRangeForVariant(
            headingSizeProp[sizeKey],
            variant,
            headingSizesForVariant,
        );
        responsiveSizePropObject[sizeKey] = headingSizeProp[sizeKey] || HeadingSizes.DEFAULT;
    }

    return getStylePropsForResponsiveProp<HeadingSize>(
        responsiveSizePropObject,
        headingSizesForVariant,
    );
}

/**
 * @typedef {object} HeadingProps
 * @property {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} [as='h3'] The element that is rendered. Defaults to `h3`.
 * @property {'xsmall' | 'small' | 'default' | 'large' | 'xlarge' | 'xxlarge'} [size='default'] The `size` of the heading. Defaults to `default`. Can be a responsive prop object.
 * @property {'default' | 'caps'} [size='default'] The `variant` of the heading. Defaults to `default`.
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
type HeadingProps = {|
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
    size?: ResponsivePropObject<HeadingSize> | HeadingSize,
    variant?: HeadingVariant,
    children?: React.Node,
    id?: string,
    role?: string,
    dataAttributes?: {+[string]: mixed},
    className?: string,
    style?: {+[string]: mixed},
    ...AriaProps,
    ...AllStylesProps,
|};

/**
 * A heading component with sizes and variants.
 *
 * @example
 * import {Heading} from '@airtable/blocks/ui';
 * import React, {Fragment} from 'react';
 *
 * function HeadingExample() {
 *     return (
 *         <Fragment>
 *             <Heading>Default heading</Heading>
 *             <Heading size="small" variant="caps">Small all caps heading</Heading>
 *             <Heading
 *                  size={{
 *                      xsmallViewport: 'xsmall',
 *                      smallViewport: 'xsmall',
 *                      mediumViewport: 'small',
 *                      largeViewport: 'default'
 *                  }}
 *              >Responsive heading</Heading>
 *         </Fragment>
 *     );
 * }
 */
function Heading(props: HeadingProps, ref) {
    const {
        as: Component,
        size,
        variant,
        children,
        id,
        role,
        dataAttributes = {},
        className,
        style,
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
    invariant(Component !== undefined, 'as');
    invariant(size !== undefined, 'size');
    invariant(variant !== undefined, 'variant');
    const stylePropsForTextSize = useHeadingSize(size, variant);
    const classNameForStyleProps = useStyledSystem<AllStylesProps>({
        ...stylePropsForTextSize,
        ...styleProps,
    });
    return (
        <Component
            ref={ref}
            id={id}
            className={cx(classNameForStyleProps, className)}
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
        </Component>
    );
}

const ForwardedRefHeading = React.forwardRef/* :: <HeadingProps, HTMLElement> */(Heading);

// eslint-disable-next-line flowtype/no-weak-types
(ForwardedRefHeading: any).propTypes = {
    as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    size: createResponsivePropType(PropTypes.oneOf(values(HeadingSizes))),
    variant: PropTypes.oneOf(values(HeadingVariants)),
    children: PropTypes.node,
    id: PropTypes.string,
    role: PropTypes.string,
    dataAttributes: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
    ...allStylesPropTypes,
    ...ariaPropTypes,
};

// eslint-disable-next-line flowtype/no-weak-types
(ForwardedRefHeading: any).defaultProps = {
    as: 'h3',
    size: HeadingSizes.DEFAULT,
    variant: HeadingVariants.DEFAULT,
};

export default ForwardedRefHeading;
