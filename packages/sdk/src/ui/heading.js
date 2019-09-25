// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import {invariant} from '../error_utils';
import {has, values} from '../private_utils';
import useStyledSystem from './use_styled_system';
import {allStylesParser, allStylesPropTypes, type AllStylesProps} from './system/index';
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
            // We can't appease flow here, suppress the error instead.
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

type Props = {|
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

/** @private */
function Heading(
    {
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
    }: Props,
    ref,
) {
    invariant(Component !== undefined, 'as');
    invariant(size !== undefined, 'size');
    invariant(variant !== undefined, 'variant');
    const stylePropsForTextSize = useHeadingSize(size, variant);
    const classNameForStyleProps = useStyledSystem(
        {...stylePropsForTextSize, ...styleProps},
        allStylesParser,
    );
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

// prettier-ignore
const ForwardedRefHeading = React.forwardRef/* :: <Props, HTMLElement> */(Heading);

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
