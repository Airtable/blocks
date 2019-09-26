// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import {invariant} from '../error_utils';
import {values} from '../private_utils';
import useStyledSystem from './use_styled_system';
import {allStylesParser, allStylesPropTypes, type AllStylesProps} from './system/index';
import {type ResponsivePropObject} from './system/utils/types';
import {stylePropType} from './system/utils/create_style_prop_types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import useTheme from './theme/use_theme';
import {ariaPropTypes, type AriaProps} from './types/aria_props';

export const TextVariants = Object.freeze({
    DEFAULT: 'default',
    PARAGRAPH: 'paragraph',
});
export type TextVariant = $Values<typeof TextVariants>;

export const TextSizes = Object.freeze({
    XSMALL: 'xsmall',
    SMALL: 'small',
    DEFAULT: 'default',
    LARGE: 'large',
});
export type TextSize = $Values<typeof TextSizes>;
export type TextSizeProp = ResponsivePropObject<TextSize> | TextSize;

/** @private */
export function useTextSize(
    textSizeProp: TextSizeProp,
    variant: TextVariant,
): $Shape<AllStylesProps> {
    const {textSizesByVariant} = useTheme();
    const textSizesForVariant = textSizesByVariant[variant];
    if (typeof textSizeProp === 'string') {
        return textSizesForVariant[textSizeProp];
    }
    return getStylePropsForResponsiveProp<TextSize>(textSizesForVariant, textSizeProp);
}

type Props = {|
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
        | 'blockquote',
    size?: TextSizeProp,
    variant?: TextVariant,
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
function Text(
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
    invariant(Component, 'as');
    invariant(size, 'size');
    invariant(variant, 'variant');
    const stylePropsForTextSize = useTextSize(size, variant);
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

const ForwardedRefText = React.forwardRef/* :: <Props, HTMLElement> */(Text);

// eslint-disable-next-line flowtype/no-weak-types
(ForwardedRefText: any).propTypes = {
    as: PropTypes.oneOf([
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'span',
        'li',
        'em',
        'strong',
        'kbd',
        'mark',
        'q',
        's',
        'samp',
        'small',
        'sub',
        'sup',
        'time',
        'var',
        'blockquote',
    ]),
    size: stylePropType.isRequired,
    variant: PropTypes.oneOf(values(TextVariants)),
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
(ForwardedRefText: any).defaultProps = {
    as: 'p',
    size: TextSizes.DEFAULT,
    variant: TextVariants.DEFAULT,
};

export default ForwardedRefText;
