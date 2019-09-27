// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import {invariant} from '../error_utils';
import {values} from '../private_utils';
import useStyledSystem from './use_styled_system';
import {allStylesParser, allStylesPropTypes, type AllStylesProps} from './system/index';
import {type ResponsivePropObject} from './system/utils/types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import createResponsivePropType from './system/utils/create_responsive_prop_type';
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
    return getStylePropsForResponsiveProp<TextSize>(textSizeProp, textSizesForVariant);
}

/**
 * @typedef {object} TextProps
 * @property {'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'li' | 'em' | 'strong' | 'kbd' | 'mark' | 'q' | 's' | 'samp' | 'small' | 'sub' | 'sup' | 'time' | 'var' | 'blockquote'} [as='p'] The element that is rendered. Defaults to `p`.
 * @property {'xsmall' | 'small' | 'default' | 'large'} [size='default'] The `size` of the text. Defaults to `default`. Can be a responsive prop object.
 * @property {'default' | 'paragraph'} [size='default'] The `variant` of the heading. Defaults to `default`.
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
type TextProps = {|
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

/**
 * A text component with sizes and variants.
 *
 * @example
 * import {Text} from '@airtable/blocks/ui';
 * import React, {Fragment} from 'react';
 *
 * function TextExample() {
 *     return (
 *         <Fragment>
 *             <Text>Default text, for single line text</Text>
 *             <Text size="small" variant="paragraph">Small paragraph, for multiline paragraphs</Text>
 *             <Text
 *                  size={{
 *                      xsmallViewport: 'xsmall',
 *                      smallViewport: 'xsmall',
 *                      mediumViewport: 'small',
 *                      largeViewport: 'default'
 *                  }}
 *              >Responsive text</Text>
 *         </Fragment>
 *     );
 * }
 */
function Text(props: TextProps, ref) {
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

// prettier-ignore
const ForwardedRefText = React.forwardRef/* :: <TextProps, HTMLElement> */(Text);

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
    size: createResponsivePropType(PropTypes.oneOf(values(TextSizes))),
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
