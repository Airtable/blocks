/** @module @airtable/blocks/ui: Button */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {createEnum, EnumType, createPropTypeFromEnum} from '../private_utils';
import useStyledSystem from './use_styled_system';
import {Prop} from './system/utils/types';
import createResponsivePropType from './system/utils/create_responsive_prop_type';
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
    margin,
    marginPropTypes,
    MarginProps,
    display,
} from './system';
import useTheme from './theme/use_theme';
import {ControlSize, ControlSizeProp, controlSizePropType, useButtonSize} from './control_sizes';
import {ariaPropTypes, AriaProps} from './types/aria_props';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import {IconName, iconNamePropType} from './icon_config';
import Icon from './icon';
import cssHelpers from './css_helpers';
import Box from './box';

/** */
interface ButtonStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {
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
    margin,
);

const buttonStylePropTypes = {
    display: createResponsivePropType(PropTypes.oneOf(['inline-flex', 'flex', 'none'])),
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/** */
type ButtonVariant = EnumType<typeof ButtonVariant>;
const ButtonVariant = createEnum('default', 'primary', 'secondary', 'danger');
const buttonVariantPropType = createPropTypeFromEnum(ButtonVariant);

/** @internal */
function useButtonVariant(variant: ButtonVariant = ButtonVariant.default): string {
    const {buttonVariants} = useTheme();
    return buttonVariants[variant];
}

/** */
interface ButtonProps extends TooltipAnchorProps<HTMLButtonElement>, AriaProps, ButtonStyleProps {
    /** The size of the button. Defaults to `default`. Can be a responsive prop object. */
    size?: ControlSizeProp;
    /** The variant of the button. Defaults to `default`. */
    variant?: ButtonVariant;
    /** The name of the icon or a react node. For more details, see the [list of supported icons](/packages/sdk/docs/icons.md). */
    icon?: IconName | React.ReactElement;
    /** The type of the button. Defaults to `button`. */
    type?: 'button' | 'submit' | 'reset';
    /** The `id` attribute. */
    id?: string;
    /** Indicates whether or not the user can interact with the button. */
    disabled?: boolean;
    /** Indicates if the button can be focused and if/where it participates in sequential keyboard navigation. */
    tabIndex?: number;
    /** The contents of the button. */
    children: React.ReactNode;
    // `onClick` is already defined in `TooltipAnchorProps`, for clarity we list it again.
    /** Click event handler. Also handles Space and Enter keypress events. */
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown;
    /** Extra `className`s to apply to the button, separated by spaces. */
    className?: string;
    /** Extra styles to apply to the button. */
    style?: React.CSSProperties;
    /** The `aria-selected` attribute. */
    'aria-selected'?: boolean;
}

/**
 * Clickable button component.
 *
 * @example
 * ```js
 * import {Button} from '@airtable/blocks/ui';
 *
 * const button = (
 *     <Button
 *         onClick={() => alert('Clicked!')}
 *         disabled={false}
 *         variant="primary"
 *     >
 *         Click here!
 *     </Button>
 * );
 * ```
 */

const Button = React.forwardRef(
    (
        {
            size = ControlSize.default,
            variant = ButtonVariant.default,
            icon,
            id,
            className,
            style,
            onMouseEnter,
            onMouseLeave,
            onClick,
            type = 'button',
            disabled,
            tabIndex,
            children,
            'aria-label': ariaLabel,
            'aria-selected': ariaSelected,
            ...styleProps
        }: ButtonProps,
        ref: React.Ref<HTMLButtonElement>,
    ) => {
        const classNameForButtonSize = useButtonSize(size);
        const classNameForButtonVariant = useButtonVariant(variant);
        const classNameForStyleProps = useStyledSystem(
            {display: 'inline-flex', ...styleProps},
            styleParser,
        );
        const hasIcon = icon !== undefined;

        return (
            <button
                ref={ref}
                id={id}
                className={cx(
                    classNameForButtonVariant,
                    classNameForButtonSize,
                    classNameForStyleProps,
                    className,
                )}
                style={style}
                // TODO (stephen): remove tooltip anchor props
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                type={type}
                disabled={disabled}
                tabIndex={tabIndex}
                aria-label={ariaLabel}
                aria-selected={ariaSelected}
            >
                {typeof icon === 'string' ? (
                    <Icon name={icon as IconName} size="1em" fillColor="currentColor" flex="none" />
                ) : (
                    icon
                )}

                <Box
                    as="span"
                    // The margin is on the span, and not on the icon because it would mean that when using a custom icon
                    // the consumer would manually need to figure out what the margin is supposed to be.
                    marginLeft={hasIcon ? '0.5em' : undefined}
                    className={cssHelpers.TRUNCATE}
                >
                    {children}
                </Box>
            </button>
        );
    },
);

Button.propTypes = {
    size: controlSizePropType,
    variant: buttonVariantPropType,
    icon: PropTypes.oneOfType([iconNamePropType, PropTypes.element]),
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    // `onClick` is already defined in `tooltipAnchorPropTypes`, for clarity we list it again.
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset'] as const),
    disabled: PropTypes.bool,
    tabIndex: PropTypes.number,
    children: PropTypes.node.isRequired,
    ...buttonStylePropTypes,
    ...tooltipAnchorPropTypes,
    ...ariaPropTypes,
};

export default Button;
