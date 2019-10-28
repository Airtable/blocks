/** @module @airtable/blocks/ui: TextButton */ /** */
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import {compose} from '@styled-system/core';
import {createEnum, EnumType, createPropTypeFromEnum} from '../private_utils';
import useStyledSystem from './use_styled_system';
import useTheme from './theme/use_theme';
import {ariaPropTypes, AriaProps} from './types/aria_props';
import createResponsivePropType from './system/utils/create_responsive_prop_type';
import {Prop} from './system/utils/types';
import {
    maxWidth,
    maxWidthPropTypes,
    MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    MinWidthProps,
    width,
    widthPropTypes,
    WidthProps,
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    spacingSet,
    spacingSetPropTypes,
    SpacingSetProps,
    display,
} from './system';
import {useTextStyle, TextSize, TextSizeProp, textSizePropType} from './text';
import {IconName, iconNamePropType} from './icon_config';
import Icon from './icon';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import cssHelpers from './css_helpers';
import Box from './box';
import {DataAttributesProp} from './types/data_attributes';

/** */
export interface TextButtonStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        SpacingSetProps {
    /** */
    display?: Prop<'inline-flex' | 'flex' | 'none'>;
}

const styleParser = compose(
    display,
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    spacingSet,
);

export const textButtonStylePropTypes = {
    display: createResponsivePropType(PropTypes.oneOf(['inline-flex', 'flex', 'none'])),
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...spacingSetPropTypes,
};

/** */
type TextButtonVariant = EnumType<typeof TextButtonVariant>;
const TextButtonVariant = createEnum('default', 'dark', 'light');
const textButtonVariantPropType = createPropTypeFromEnum(TextButtonVariant);

/** @internal */
function useTextButtonVariant(variant: TextButtonVariant = TextButtonVariant.default): string {
    const {textButtonVariants} = useTheme();
    return textButtonVariants[variant];
}

/**
 * @typedef {object} TextButtonProps
 */
interface TextButtonProps
    extends TooltipAnchorProps<HTMLSpanElement>,
        AriaProps,
        TextButtonStyleProps {
    /** The `size` of the text. Defaults to `default`. Can be a responsive prop object. */
    size?: TextSizeProp;
    /** */
    variant?: TextButtonVariant;
    /** The name of the icon or a react node. For more details, see the [list of supported icons](/packages/sdk/docs/icons.md). */
    icon?: IconName | React.ReactElement;
    /** Indicates whether or not the user can interact with the button. */
    disabled?: boolean;
    /** */
    children: React.ReactNode;
    // `onClick` is already defined in `TooltipAnchorProps`, for clarity we list it again and refine it to include `KeyboardEvent`.
    /** Click event handler. Also handles Space and Enter keypress events. */
    onClick?: (
        e: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>,
    ) => unknown;
    /** The `id` attribute. */
    id?: string;
    /** The `tabIndex` attribute. */
    tabIndex?: number;
    /** Additional class names to apply, separated by spaces. */
    className?: string;
    /** Additional styles. */
    style?: React.CSSProperties;
    /** Data attributes that are spread onto the element `dataAttributes={{'data-*': '...'}}`. */
    dataAttributes?: DataAttributesProp;
    /** The `aria-selected` attribute. */
    ['aria-selected']?: boolean;
}

/**
 * A text button component with sizes and variants.
 *
 * @example
 * import {TextButton} from '@airtable/blocks/ui';
 * import React, {Fragment} from 'react';
 *
 * function TextButtonExample() {
 *     return (
 *         <Fragment>
 *             <TextButton>Default text, for single line text</TextButton>
 *             <TextButton size="small">Small text button</TextButton>
 *             <TextButton
 *                  size={{
 *                      xsmallViewport: 'small',
 *                      smallViewport: 'small',
 *                      mediumViewport: 'default',
 *                      largeViewport: 'large'
 *                  }}
 *              >Responsive text button</TextButton>
 *         </Fragment>
 *     );
 * }
 */
const TextButton = React.forwardRef<HTMLSpanElement, TextButtonProps>(
    (
        {
            size = TextSize.default,
            variant = TextButtonVariant.default,
            icon,
            children,
            disabled,
            id,
            tabIndex = 0,
            dataAttributes,
            onClick,
            className,
            style,
            onMouseEnter,
            onMouseLeave,
            hasOnClick,
            'aria-selected': ariaSelected,
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledBy,
            'aria-describedby': ariaDescribedBy,
            'aria-controls': ariaControls,
            'aria-expanded': ariaExpanded,
            'aria-haspopup': ariaHasPopup,
            'aria-hidden': ariaHidden,
            'aria-live': ariaLive,
            ...styleProps
        }: TextButtonProps,
        ref: React.Ref<HTMLSpanElement>,
    ) => {
        const classNameForTextStyle = useTextStyle(size);
        const classNameForTextButtonVariant = useTextButtonVariant(variant);
        const classNameForStyleProps = useStyledSystem<TextButtonStyleProps>(
            {
                display: 'inline-flex',
                // Use a negative margin to undo the padding.
                padding: '0 0.1em',
                margin: '0 -0.1em',
                maxWidth: '100%',
                ...styleProps,
            },
            styleParser,
        );

        /** @internal */
        function _onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
            if (e.ctrlKey || e.metaKey || e.shiftKey) {
                return;
            }

            //  Use `Spacebar` to support FF <= 37, IE 9-11.
            if ([' ', 'Spacebar', 'Enter'].includes(e.key)) {
                // Prevent scrolling when pressing `Spacebar`.
                e.preventDefault();
                if (onClick) {
                    onClick(e);
                }
            }
        }

        return (
            <span
                ref={ref}
                id={id}
                // Don't set `tabIndex` if `disabled`. We do set it though even if
                // `onClick` is not provided so that it mimics the behavior of a native
                // `button`. We also prevent the user from passing in their own
                // `tabIndex` in the case that it is disabled. This is better than a
                // `-1` because `-1` will make the element focusable but not reachable
                // via keyboard navigation.
                tabIndex={!disabled ? tabIndex : undefined}
                // Only fire these events if the `disabled` prop is not true.
                onClick={!disabled ? onClick : undefined}
                onKeyDown={!disabled ? _onKeyDown : undefined}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={cx(
                    classNameForTextStyle,
                    // TextButton goes 2nd because it overrides `fontWeight`.
                    classNameForTextButtonVariant,
                    classNameForStyleProps,
                    className,
                )}
                style={style}
                // Always have `role="button"`, even if it is disabled. Combined with
                // `aria-disabled`, screen readers will announce this the same as
                // a native `button` element.
                role="button"
                // Announce to screen readers that the `TextButton` is disabled.
                aria-disabled={disabled ? 'true' : undefined}
                aria-selected={ariaSelected}
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
                {typeof icon === 'string' ? (
                    <Icon name={icon as IconName} flex="none" size="1em" />
                ) : (
                    icon
                )}
                <Box
                    as="span"
                    // The margin is on the span, and not on the icon because it would mean that when using a custom icon
                    // the consumer would manually need to figure out what the margin is supposed to be.
                    marginLeft={icon !== undefined ? '0.5em' : undefined}
                    className={cssHelpers.TRUNCATE}
                >
                    {children}
                </Box>
            </span>
        );
    },
);

TextButton.propTypes = {
    size: textSizePropType,
    variant: textButtonVariantPropType,
    icon: PropTypes.oneOfType([iconNamePropType, PropTypes.element]),
    disabled: PropTypes.bool,
    children: PropTypes.node,
    id: PropTypes.string,
    tabIndex: PropTypes.number,
    // `onClick` is already defined in `tooltipAnchorPropTypes`, for clarity we list it again.
    onClick: PropTypes.func,
    dataAttributes: PropTypes.any,
    className: PropTypes.string,
    style: PropTypes.object,
    'aria-selected': PropTypes.bool,
    ...textButtonStylePropTypes,
    ...ariaPropTypes,
    ...tooltipAnchorPropTypes,
};

export default TextButton;
