/** @module @airtable/blocks/ui: Text */ /** */
import * as React from 'react';
import {cx} from 'emotion';
import {createEnum, EnumType} from '../../shared/private_utils';
import useStyledSystem from './use_styled_system';
import {AllStylesProps} from './system/index';
import {ResponsiveProp} from './system/utils/types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import useTheme from './theme/use_theme';
import {AriaProps} from './types/aria_props';
import {DataAttributesProp} from './types/data_attributes_prop';

/**
 * Variants for the {@link Text} component:
 *
 * • **default**
 *
 * Single-line text.
 *
 * • **paragraph**
 *
 * Multi-line text such as body copy.
 */
export type TextVariant = EnumType<typeof TextVariant>;
export const TextVariant = createEnum('default', 'paragraph');

/**
 * Sizes for the {@link Text} component.
 */
export type TextSize = EnumType<typeof TextSize>;
export const TextSize = createEnum('small', 'default', 'large', 'xlarge');
/** */
export type TextSizeProp = ResponsiveProp<TextSize>;

/** @internal */
export function useTextStyle(
    textSizeProp: TextSizeProp,
    variant: TextVariant = TextVariant.default,
): string {
    const {textStyles} = useTheme();
    const textSizesForVariant = textStyles[variant];
    let styleProps;
    if (typeof textSizeProp === 'string') {
        styleProps = textSizesForVariant[textSizeProp];
    } else {
        styleProps = getStylePropsForResponsiveProp<TextSize>(textSizeProp, textSizesForVariant);
    }
    return useStyledSystem(styleProps);
}

/**
 * Props for the {@link Text} component. Also supports:
 * * {@link AriaProps}
 * * {@link AllStylesProps}
 *
 * @noInheritDoc
 * @docsPath UI/components/Text
 */
export interface TextProps extends AriaProps, AllStylesProps {
    /** The element that is rendered. Defaults to `p`. */
    as?:
        | 'p'
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
        | 'span'
        | 'li'
        | 'em'
        | 'strong'
        | 'kbd'
        | 'mark'
        | 'q'
        | 's'
        | 'samp'
        | 'small'
        | 'sub'
        | 'sup'
        | 'time'
        | 'var'
        | 'blockquote';
    /** The variant of the text. Defaults to `default`. */
    variant?: TextVariant;
    /** The contents of the text. */
    children?: React.ReactNode | string;
    /** The `id` attribute. */
    id?: string;
    /** The size of the text. Defaults to `default`. Can be a responsive prop object. */
    size?: TextSizeProp;
    /** Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`. */
    dataAttributes?: DataAttributesProp;
    /** Additional class names to apply, separated by spaces. */
    className?: string;
    /** Additional styles. */
    style?: React.CSSProperties;
    /** The `role` attribute. */
    role?: string;
}

/**
 * A text component with sizes and variants.
 *
 * [[ Story id="text--example" title="Text example" ]]
 *
 * @docsPath UI/components/Text
 * @component
 */
const Text = (props: TextProps, ref: React.Ref<HTMLElement>) => {
    const {
        as: Component = 'p',
        size = TextSize.default,
        variant = TextVariant.default,
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

    const classNameForTextStyle = useTextStyle(size, variant);
    const classNameForStyleProps = useStyledSystem({
        textColor: 'default',
        fontFamily: 'default',
        ...styleProps,
    });
    return (
        <Component
            ref={ref as any}
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
        </Component>
    );
};

const ForwardedRefText = React.forwardRef<HTMLElement, TextProps>(Text);

ForwardedRefText.displayName = 'Text';

export default ForwardedRefText;
