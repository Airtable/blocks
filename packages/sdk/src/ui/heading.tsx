/** @module @airtable/blocks/ui: Heading */ /** */
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import {spawnInvariantViolationError} from '../error_utils';
import {
    has,
    createEnum,
    createPropTypeFromEnum,
    createResponsivePropTypeFromEnum,
    ObjectMap,
    keys,
    EnumType,
} from '../private_utils';
import useStyledSystem from './use_styled_system';
import {allStylesPropTypes, AllStylesProps} from './system/index';
import {ResponsiveProp, ResponsiveKey} from './system/utils/types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import useTheme from './theme/use_theme';
import {ariaPropTypes, AriaProps} from './types/aria_props';

type HeadingSize = EnumType<typeof HeadingSize>;
const HeadingSize = createEnum('xsmall', 'small', 'default', 'large', 'xlarge', 'xxlarge');
type HeadingSizeProp = ResponsiveProp<HeadingSize>;
const headingSizePropType = createResponsivePropTypeFromEnum(HeadingSize);

type HeadingVariant = EnumType<typeof HeadingVariant>;
const HeadingVariant = createEnum('default', 'caps');
const headingVariantPropType = createPropTypeFromEnum(HeadingVariant);

/** @internal */
function warnIfHeadingSizeOutOfRangeForVariant(
    size: HeadingSize,
    variant: HeadingVariant,
    headingSizesForVariant: {[Size in HeadingSize]?: object},
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

/** @internal */
function useHeadingSize(
    headingSizeProp: HeadingSizeProp,
    variant: HeadingVariant,
): Partial<AllStylesProps> {
    const {headingSizesByVariant} = useTheme();
    const headingSizesForVariant = headingSizesByVariant[variant];

    if (typeof headingSizeProp === 'string') {
        warnIfHeadingSizeOutOfRangeForVariant(headingSizeProp, variant, headingSizesForVariant);
        return (headingSizesForVariant[headingSizeProp] ||
            headingSizesForVariant[HeadingSize.default]) as Partial<AllStylesProps>;
    }

    const responsiveSizePropObject = {} as ObjectMap<ResponsiveKey, HeadingSize>;
    for (const sizeKey of keys(headingSizeProp)) {
        const sizeProp = headingSizeProp[sizeKey];
        if (!sizeProp) {
            throw spawnInvariantViolationError('sizeProp');
        }

        warnIfHeadingSizeOutOfRangeForVariant(sizeProp, variant, headingSizesForVariant);
        responsiveSizePropObject[sizeKey] = sizeProp || HeadingSize.default;
    }

    return getStylePropsForResponsiveProp<HeadingSize>(
        responsiveSizePropObject,

        // TODO: fix after typescript migration
        headingSizesForVariant as any,
    );
}

/**
 * @typedef {object} HeadingProps
 * @property {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} [as='h3'] The element that is rendered. Defaults to `h3`.
 * @property {'xsmall' | 'small' | 'default' | 'large' | 'xlarge' | 'xxlarge'} [size='default'] The `size` of the heading. Defaults to `default`. Can be a responsive prop object.
 * @property {'default' | 'caps'} [variant='default'] The `variant` of the heading. Defaults to `default`.
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
interface HeadingProps extends AriaProps, AllStylesProps {
    role?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    variant?: HeadingVariant;
    children?: React.ReactNode;
    id?: string;
    size?: HeadingSizeProp;
    dataAttributes?: {readonly [key: string]: unknown};
    className?: string;
    style?: React.CSSProperties;
}

/**
 * A heading component with sizes and variants.
 *
 * ```js
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
 * ```
 */
function Heading(props: HeadingProps, ref: React.Ref<HTMLHeadingElement>) {
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
    if (!(Component !== undefined)) {
        throw spawnInvariantViolationError('as');
    }
    if (!(size !== undefined)) {
        throw spawnInvariantViolationError('size');
    }
    if (!(variant !== undefined)) {
        throw spawnInvariantViolationError('variant');
    }
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

const ForwardedRefHeading = React.forwardRef<HTMLHeadingElement, HeadingProps>(Heading);

(ForwardedRefHeading as any).propTypes = {
    as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    size: headingSizePropType,
    variant: headingVariantPropType,
    children: PropTypes.node,
    id: PropTypes.string,
    role: PropTypes.string,
    dataAttributes: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
    ...allStylesPropTypes,
    ...ariaPropTypes,
};

ForwardedRefHeading.defaultProps = {
    as: 'h3',
    size: HeadingSize.default,
    variant: HeadingVariant.default,
};

export default ForwardedRefHeading;
