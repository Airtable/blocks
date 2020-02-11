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
import {OptionalResponsiveProp} from './system/utils/types';
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
import {DataAttributesProp} from './types/data_attributes_prop';

/**
 * Style props for the {@link TextButton} component. Also accepts:
 * * {@link FlexItemSetProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link SpacingSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
export interface TextButtonStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        SpacingSetProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: OptionalResponsiveProp<'inline-flex' | 'flex' | 'none'>;
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

/**
 * Variants for the {@link TextButton} component:
 *
 * • **default**
 *
 * Blue text.
 *
 * • **dark**
 *
 * Dark gray text.
 *
 * • **light**
 *
 * Light gray text.
 */
type TextButtonVariant = EnumType<typeof TextButtonVariant>;
const TextButtonVariant = createEnum('default', 'dark', 'light');
const textButtonVariantPropType = createPropTypeFromEnum(TextButtonVariant);

/** @internal */
function useTextButtonVariant(variant: TextButtonVariant = TextButtonVariant.default): string {
    const {textButtonVariants} = useTheme();
    return textButtonVariants[variant];
}

/**
 * Props for the {@link TextButton} component. Also supports:
 * * {@link AriaProps}
 * * {@link TextButtonStyleProps}
 *
 * @noInheritDoc
 * @docsPath UI/components/TextButton
 */
interface TextButtonProps
    extends TooltipAnchorProps<HTMLSpanElement>,
        AriaProps,
        TextButtonStyleProps {
    /** The size of the button. Defaults to `default`. Can be a responsive prop object. */
    size?: TextSizeProp;
    /** The variant of the button, which defines the color. Defaults to `default`. */
    variant?: TextButtonVariant;
    /** The name of the icon or a react node. For more details, see the {@link IconName|list of supported icons}. */
    icon?: IconName | React.ReactElement;
    /** Indicates whether or not the user can interact with the button. */
    disabled?: boolean;
    /** The contents of the button. */
    children: React.ReactNode | string;
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
    /** Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`. */
    dataAttributes?: DataAttributesProp;
    /** The `aria-selected` attribute. */
    ['aria-selected']?: boolean;
}

/**
 * A text button component with sizes and variants.
 *
 * [[ Story id="textbutton--example" title="Text button example" ]]
 *
 * @docsPath UI/components/TextButton
 * @component
 */
const TextButton = (props: TextButtonProps, ref: React.Ref<HTMLSpanElement>) => {
    const {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    } = props;

    const classNameForTextStyle = useTextStyle(size);
    const classNameForTextButtonVariant = useTextButtonVariant(variant);
    const classNameForStyleProps = useStyledSystem<TextButtonStyleProps>(
        {
            display: 'inline-flex',
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

        if ([' ', 'Spacebar', 'Enter'].includes(e.key)) {
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
            tabIndex={!disabled ? tabIndex : undefined}
            onClick={!disabled ? onClick : undefined}
            onKeyDown={!disabled ? _onKeyDown : undefined}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cx(
                classNameForTextStyle,
                classNameForTextButtonVariant,
                classNameForStyleProps,
                className,
            )}
            style={style}
            role="button"
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
                marginLeft={icon !== undefined ? '0.5em' : undefined}
                className={cssHelpers.TRUNCATE}
            >
                {children}
            </Box>
        </span>
    );
};

const ForwardedRefTextButton = React.forwardRef<HTMLSpanElement, TextButtonProps>(TextButton);

ForwardedRefTextButton.propTypes = {
    size: textSizePropType,
    variant: textButtonVariantPropType,
    icon: PropTypes.oneOfType([iconNamePropType, PropTypes.element]),
    disabled: PropTypes.bool,
    children: PropTypes.node,
    id: PropTypes.string,
    tabIndex: PropTypes.number,
    onClick: PropTypes.func,
    dataAttributes: PropTypes.any,
    className: PropTypes.string,
    style: PropTypes.object,
    'aria-selected': PropTypes.bool,
    ...textButtonStylePropTypes,
    ...ariaPropTypes,
    ...tooltipAnchorPropTypes,
};

ForwardedRefTextButton.displayName = 'TextButton';

export default ForwardedRefTextButton;
