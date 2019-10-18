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
import {IconName} from './icon_config';
import Icon from './icon';
import cssHelpers from './css_helpers';
import Box from './box';

interface StyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {
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

const stylePropTypes = {
    display: createResponsivePropType(PropTypes.oneOf(['inline-flex', 'flex', 'none'])),
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

type ButtonVariant = EnumType<typeof ButtonVariant>;
const ButtonVariant = createEnum('default', 'primary', 'secondary', 'danger');
const buttonVariantPropType = createPropTypeFromEnum(ButtonVariant);

/** @internal */
function useButtonVariant(variant: ButtonVariant = ButtonVariant.default): string {
    const {buttonVariants} = useTheme();
    return buttonVariants[variant];
}

/**
 * @typedef {object} ButtonProps
 * @property {'small' | 'default' | 'large'} [size='default'] The size of the button. Defaults to `default`. Can be a responsive prop object.
 * @property {'default' | 'primary' | 'secondary' | 'danger'} [variant='default'] The variant of the button. Defaults to `default`.
 * @property {string | React.Node} [icon] The name of the icon or a react node. For more details, see the [list of supported icons](/packages/sdk/docs/icons.md).
 * @property {'button' | 'submit' | 'reset'} [type='button'] The type of the button. Defaults to `button`.
 * @property {string} [id] The `id` attribute.
 * @property {boolean} [disabled] Indicates whether or not the user can interact with the button.
 * @property {number} [tabIndex] Indicates if the button can be focused and if/where it participates in sequential keyboard navigation.
 * @property {Function} [onClick] Click event handler. Also handles Space and Enter keypress events.
 * @property {string} [className] Extra `className`s to apply to the button, separated by spaces.
 * @property {object} [style] Extra styles to apply to the button.
 * @property {string} [aria-selected] The `aria-selected` attribute.
 * @property {string} [aria-label] The `aria-label` attribute. Use this if the button lacks a visible text label.
 * @property {string} [aria-labelledby] The `aria-labelledby` attribute. A space separated list of label element IDs.
 * @property {string} [aria-describedby] The `aria-describedby` attribute. A space separated list of description element IDs.
 * @property {string} [aria-controls] The `aria-controls` attribute.
 * @property {string} [aria-expanded] The `aria-expanded` attribute.
 * @property {string} [aria-haspopup] The `aria-haspopup` attribute.
 * @property {string} [aria-hidden] The `aria-hidden` attribute.
 * @property {string} [aria-live] The `aria-live` attribute.
 */
interface ButtonProps extends TooltipAnchorProps<HTMLButtonElement>, AriaProps, StyleProps {
    size?: ControlSizeProp;
    variant?: ButtonVariant;
    icon?: IconName | React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    disabled?: boolean;
    tabIndex?: number;
    children: React.ReactNode;
    // `onClick` is already defined in `TooltipAnchorProps`, for clarity we list it again.
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown;
    className?: string;
    style?: React.CSSProperties;
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
                    <Icon name={icon} size="1em" fillColor="currentColor" flex="none" />
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
    icon: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    // `onClick` is already defined in `tooltipAnchorPropTypes`, for clarity we list it again.
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset'] as const),
    disabled: PropTypes.bool,
    tabIndex: PropTypes.number,
    children: PropTypes.node.isRequired,
    ...stylePropTypes,
    ...tooltipAnchorPropTypes,
    ...ariaPropTypes,
};

export default Button;
