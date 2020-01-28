/** @module @airtable/blocks/ui: Button */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {createEnum, EnumType, createPropTypeFromEnum} from '../private_utils';
import useStyledSystem from './use_styled_system';
import {OptionalResponsiveProp} from './system/utils/types';
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

/**
 * Style props for the {@link Button} component. Also accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
interface ButtonStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: OptionalResponsiveProp<'inline-flex' | 'flex' | 'none'>;
}

const styleParser = compose(display, maxWidth, minWidth, width, flexItemSet, positionSet, margin);

export const buttonStylePropTypes = {
    display: createResponsivePropType(PropTypes.oneOf(['inline-flex', 'flex', 'none'])),
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/**
 * Variants for the {@link Button} component:
 *
 * • **default**
 *
 * Gray button for toolbars and other generic actions.
 *
 * • **primary**
 *
 * Blue button used for primary actions and CTAs. There should only be one primary button present at a time. Often used in {@link Dialog} and bottom bars.
 *
 * • **secondary**
 *
 * Transparent button that pairs with the primary button. This is typically used for cancel or back buttons.
 *
 * • **danger**
 *
 * Red button that replaces primary buttons for dangerous or otherwise difficult-to-reverse actions like record deletion.
 */
type ButtonVariant = EnumType<typeof ButtonVariant>;
const ButtonVariant = createEnum('default', 'primary', 'secondary', 'danger');
const buttonVariantPropType = createPropTypeFromEnum(ButtonVariant);

/** @internal */
function useButtonVariant(variant: ButtonVariant = ButtonVariant.default): string {
    const {buttonVariants} = useTheme();
    return buttonVariants[variant];
}

/**
 * Props for the {@link Button} component. Also accepts:
 * * {@link AriaProps}
 * * {@link ButtonStyleProps}
 *
 * @noInheritDoc
 * @docsPath UI/components/Button
 */
interface ButtonProps extends AriaProps, ButtonStyleProps, TooltipAnchorProps<HTMLButtonElement> {
    /** The size of the button. Defaults to `default`. Can be a responsive prop object. */
    size?: ControlSizeProp;
    /** The variant of the button. Defaults to `default`. */
    variant?: ButtonVariant;
    /** The name of the icon or a React node. For more details, see the [list of supported icons](/packages/sdk/docs/icons.md). */
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
    children?: React.ReactNode | string;
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
 * @component
 * @docsPath UI/components/Button
 */
const Button = (props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    const {
        size = ControlSize.default,
        variant = ButtonVariant.default,
        icon,
        id,
        className,
        style,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        type = 'button',
        disabled,
        tabIndex,
        children,
        'aria-label': ariaLabel,
        'aria-selected': ariaSelected,
        ...styleProps
    } = props;

    const classNameForButtonSize = useButtonSize(size);
    const classNameForButtonVariant = useButtonVariant(variant);
    const classNameForStyleProps = useStyledSystem(
        {display: 'inline-flex', ...styleProps},
        styleParser,
    );
    const hasIcon = icon !== undefined;
    const hasChildren = !!children;

    if (!hasChildren && !ariaLabel) {
        // eslint-disable-next-line no-console
        console.error('<Button> without a text label should include an explicit aria-label prop.');
    }

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

            {hasChildren && (
                <Box
                    as="span"
                    marginLeft={hasIcon ? '0.5em' : undefined}
                    className={cssHelpers.TRUNCATE}
                >
                    {children}
                </Box>
            )}
        </button>
    );
};

const ForwardedRefButton = React.forwardRef<HTMLButtonElement, ButtonProps>(Button);

ForwardedRefButton.propTypes = {
    size: controlSizePropType,
    variant: buttonVariantPropType,
    icon: PropTypes.oneOfType([iconNamePropType, PropTypes.element]),
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset'] as const),
    disabled: PropTypes.bool,
    tabIndex: PropTypes.number,
    children: PropTypes.node,
    ...buttonStylePropTypes,
    ...tooltipAnchorPropTypes,
    ...ariaPropTypes,
};

ForwardedRefButton.displayName = 'Button';

export default ForwardedRefButton;
