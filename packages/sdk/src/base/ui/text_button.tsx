/** @module @airtable/blocks/ui: TextButton */ /** */
import * as React from 'react';
import {cx} from 'emotion';
import {compose} from '@styled-system/core';
import {createEnum, EnumType} from '../../shared/private_utils';
import useStyledSystem from './use_styled_system';
import useTheme from './theme/use_theme';
import {AriaProps} from './types/aria_props';
import {OptionalResponsiveProp} from './system/utils/types';
import {
    maxWidth,
    MaxWidthProps,
    minWidth,
    MinWidthProps,
    width,
    WidthProps,
    flexItemSet,
    FlexItemSetProps,
    positionSet,
    PositionSetProps,
    spacingSet,
    SpacingSetProps,
    display,
} from './system';
import {useTextStyle, TextSize, TextSizeProp} from './text';
import {IconName} from './icon_config';
import Icon from './icon';
import {TooltipAnchorProps} from './types/tooltip_anchor_props';
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
export interface TextButtonProps
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
    children?: React.ReactNode | string;
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
    const hasIcon = icon !== undefined;
    const hasChildren = !!children;

    if (!hasChildren && !ariaLabel) {
        // eslint-disable-next-line no-console
        console.error(
            '<TextButton> without a text label should include an explicit aria-label prop.',
        );
    }

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
            {hasChildren && (
                <Box
                    as="span"
                    marginLeft={hasIcon ? '0.5em' : undefined}
                    className={cssHelpers.TRUNCATE}
                >
                    {children}
                </Box>
            )}
        </span>
    );
};

const ForwardedRefTextButton = React.forwardRef<HTMLSpanElement, TextButtonProps>(TextButton);

ForwardedRefTextButton.displayName = 'TextButton';

export default ForwardedRefTextButton;
