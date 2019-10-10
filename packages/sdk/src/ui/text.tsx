/** @module @airtable/blocks/ui: Text */ /** */
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import {
    createEnum,
    EnumType,
    createPropTypeFromEnum,
    createResponsivePropTypeFromEnum,
} from '../private_utils';
import useStyledSystem from './use_styled_system';
import {allStylesPropTypes, AllStylesProps} from './system/index';
import {ResponsiveProp} from './system/utils/types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import useTheme from './theme/use_theme';
import {ariaPropTypes, AriaProps} from './types/aria_props';
import {dataAttributesPropType, DataAttributesProp} from './types/data_attributes';

export type TextVariant = EnumType<typeof TextVariant>;
export const TextVariant = createEnum('default', 'paragraph');
export const textVariantPropType = createPropTypeFromEnum(TextVariant);

export type TextSize = EnumType<typeof TextSize>;
export const TextSize = createEnum('small', 'default', 'large', 'xlarge');
export type TextSizeProp = ResponsiveProp<TextSize>;
export const textSizePropType = createResponsivePropTypeFromEnum(TextSize);

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
 * @typedef {object} TextProps
 * @property {'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'li' | 'em' | 'strong' | 'kbd' | 'mark' | 'q' | 's' | 'samp' | 'small' | 'sub' | 'sup' | 'time' | 'var' | 'blockquote'} [as='p'] The element that is rendered. Defaults to `p`.
 * @property {'small' | 'default' | 'large' | 'xlarge'} [size='default'] The `size` of the text. Defaults to `default`. Can be a responsive prop object.
 * @property {'default' | 'paragraph'} [variant='default'] The `variant` of the text. Defaults to `default`.
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
interface TextProps extends AriaProps, AllStylesProps {
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
    variant?: TextVariant;
    children?: React.ReactNode;
    id?: string;
    size?: TextSizeProp;
    dataAttributes?: DataAttributesProp;
    className?: string;
    style?: React.CSSProperties;
    role?: string;
}

/**
 * A text component with sizes and variants.
 *
 * ```js
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
 *                      xsmallViewport: 'small',
 *                      smallViewport: 'small',
 *                      mediumViewport: 'default',
 *                      largeViewport: 'large'
 *                  }}
 *              >Responsive text</Text>
 *         </Fragment>
 *     );
 * }
 * ```
 */
const Text = React.forwardRef(
    (
        {
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
        }: TextProps,
        ref: React.Ref<HTMLElement>,
    ) => {
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
    },
);

Text.propTypes = {
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
    ] as const),
    size: textSizePropType,
    variant: textVariantPropType,
    children: PropTypes.node,
    id: PropTypes.string,
    role: PropTypes.string,
    dataAttributes: dataAttributesPropType,
    className: PropTypes.string,
    style: PropTypes.object,
    ...allStylesPropTypes,
    ...ariaPropTypes,
};

export default Text;
