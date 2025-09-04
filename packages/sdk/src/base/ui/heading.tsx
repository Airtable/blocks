/** @module @airtable/blocks/ui: Heading */ /** */
import * as React from 'react';
import {cx} from 'emotion';
import {invariant} from '../../shared/error_utils';
import {has, createEnum, ObjectMap, keys, EnumType} from '../../shared/private_utils';
import useStyledSystem from './use_styled_system';
import {AllStylesProps} from './system/index';
import {ResponsiveProp, ResponsiveKey} from './system/utils/types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import useTheme from './theme/use_theme';
import {AriaProps} from './types/aria_props';
import {DataAttributesProp} from './types/data_attributes_prop';

/**
 * Sizes for the {@link Heading} component.
 */
type HeadingSize = EnumType<typeof HeadingSize>;
const HeadingSize = createEnum('xsmall', 'small', 'default', 'large', 'xlarge', 'xxlarge');

/**
 * Size prop for the {@link Heading} component.
 */
type HeadingSizeProp = ResponsiveProp<HeadingSize>;

/**
 * Variant prop for the {@link Heading} component.
 * • **default** - Headings typically used for titles.
 * • **caps** - All-caps headings typically used for field names and smaller section headings.
 */
type HeadingVariant = EnumType<typeof HeadingVariant>;
const HeadingVariant = createEnum('default', 'caps');

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
function useHeadingStyle(headingSizeProp: HeadingSizeProp, variant: HeadingVariant): string {
    const {headingStyles} = useTheme();
    const headingSizesForVariant = headingStyles[variant];

    let styleProps;
    if (typeof headingSizeProp === 'string') {
        warnIfHeadingSizeOutOfRangeForVariant(headingSizeProp, variant, headingSizesForVariant);
        styleProps = (headingSizesForVariant[headingSizeProp] ||
            headingSizesForVariant[HeadingSize.default]) as Partial<AllStylesProps>;
    } else {
        const responsiveSizePropObject = {} as ObjectMap<ResponsiveKey, HeadingSize>;
        for (const sizeKey of keys(headingSizeProp)) {
            const sizeProp = headingSizeProp[sizeKey];
            invariant(sizeProp, 'sizeProp');

            warnIfHeadingSizeOutOfRangeForVariant(sizeProp, variant, headingSizesForVariant);
            responsiveSizePropObject[sizeKey] = sizeProp || HeadingSize.default;
        }

        styleProps = getStylePropsForResponsiveProp<HeadingSize>(
            responsiveSizePropObject,
            headingSizesForVariant as any,
        );
    }

    return useStyledSystem(styleProps);
}

/**
 * Props for the {@link Heading} component. Also supports:
 * * {@link AllStylesProps}
 * * {@link AriaProps}
 *
 * @docsPath UI/components/Heading
 * @noInheritDoc
 */
export interface HeadingProps extends AllStylesProps, AriaProps {
    /** The `role` attribute. */
    role?: string;
    /** The element that is rendered. Defaults to `h3`. */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** The variant of the heading. Defaults to `default`. */
    variant?: HeadingVariant;
    /** The contents of the heading. */
    children?: React.ReactNode | string;
    /** The `id` attribute. */
    id?: string;
    /** The size of the heading. Defaults to `default`. Can be a responsive prop object. */
    size?: HeadingSizeProp;
    /** Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`. */
    dataAttributes?: DataAttributesProp;
    /** Additional class names to apply, separated by spaces. */
    className?: string;
    /** Additional styles. */
    style?: React.CSSProperties;
}

/**
 * A heading component with sizes and variants.
 *
 * [[ Story id="heading--example" title="Heading example" ]]
 *
 * @docsPath UI/components/Heading
 * @component
 */
const Heading = (props: HeadingProps, ref: React.Ref<HTMLHeadingElement>) => {
    const {
        as: Component = 'h3',
        size = HeadingSize.default,
        variant = HeadingVariant.default,
        children,
        id,
        role,
        dataAttributes,
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

    const classNameForHeadingSize = useHeadingStyle(size, variant);
    const classNameForStyleProps = useStyledSystem({
        fontFamily: 'default',
        textColor: 'default',
        ...styleProps,
    });

    return (
        <Component
            ref={ref as any}
            id={id}
            className={cx(classNameForHeadingSize, classNameForStyleProps, className)}
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
};

const ForwardedRefHeading = React.forwardRef<HTMLHeadingElement, HeadingProps>(Heading);

ForwardedRefHeading.displayName = 'Heading';

export default ForwardedRefHeading;
