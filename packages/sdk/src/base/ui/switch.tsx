/** @module @airtable/blocks/ui: Switch */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import React from 'react';
import {compose} from '@styled-system/core';
import {createEnum, EnumType} from '../../shared/private_utils';
import useStyledSystem from './use_styled_system';
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
    displayPropTypes,
    backgroundColor,
    backgroundColorPropTypes,
    BackgroundColorProps,
} from './system';
import {OptionalResponsiveProp} from './system/utils/types';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import useTheme from './theme/use_theme';
import {useSwitchSize, ControlSizeProp, ControlSize} from './control_sizes';
import {createPropTypeFromEnum} from './system/utils/enum_prop_type_utils';

/**
 * Variants for the {@link Switch} component:
 *
 * • **default**
 *
 * Green switch for toggling a setting or other boolean property.
 *
 * • **danger**
 *
 * Red switch for toggling a dangerous or infrequently-used setting.
 */
type SwitchVariant = EnumType<typeof SwitchVariant>;
const SwitchVariant = createEnum('default', 'danger');
const switchVariantPropType = createPropTypeFromEnum(SwitchVariant);

/** @internal */
function useSwitchVariant(variant: SwitchVariant = SwitchVariant.default) {
    const {switchVariants} = useTheme();
    return switchVariants[variant];
}

/**
 * Props shared between the {@link Switch} and {@link SwitchSynced} components.
 *
 * @noInheritDoc
 */
export interface SharedSwitchProps extends TooltipAnchorProps, SwitchStyleProps {
    /** Additional class names to apply to the switch. */
    className?: string;
    /** If set to `true`, the user cannot interact with the switch. */
    disabled?: boolean;
    /** The label node for the switch. */
    label?: React.ReactNode | string;
    /** A function to be called when the switch is toggled. */
    onChange?: (newValue: boolean) => unknown;
    /** Indicates if the switch can be focused and if/where it participates in sequential keyboard navigation. */
    tabIndex?: number;
    /** The variant of the switch. Defaults to `default` (green). */
    variant?: SwitchVariant;
    /** The size of the switch. Defaults to `default`. */
    size?: ControlSizeProp;
    /** The ID of the switch element. */
    id?: string;
    /** Additional styles to apply to the switch. */
    style?: React.CSSProperties;
    /** The label for the switch. Use this if the switch lacks a visible text label. */
    ['aria-label']?: string;
    /** A space separated list of label element IDs. */
    ['aria-labelledby']?: string;
    /** A space separated list of description element IDs. */
    ['aria-describedby']?: string;
}

/**
 * Props for the {@link Switch} component. Also accepts:
 * * {@link SwitchStyleProps}
 *
 * @docsPath UI/components/Switch
 */
export interface SwitchProps extends SharedSwitchProps {
    /** If set to `true`, the switch will be switchd on. */
    value: boolean;
}

export const switchStylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...spacingSetPropTypes,
    ...backgroundColorPropTypes,
    ...displayPropTypes,
};

export const sharedSwitchPropTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    onChange: PropTypes.func,
    tabIndex: PropTypes.number,
    variant: switchVariantPropType,
    className: PropTypes.string,
    style: PropTypes.object,
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    ...tooltipAnchorPropTypes,
    ...switchStylePropTypes,
};

/**
 * Style props for the {@link Switch} component. Also accepts:
 * * {@link BackgroundColorProps}
 * * {@link FlexItemSetProps}
 * * {@link MinWidthProps}
 * * {@link MaxWidthProps}
 * * {@link PositionSetProps}
 * * {@link SpacingSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
export interface SwitchStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        SpacingSetProps,
        BackgroundColorProps {
    /** */
    display?: OptionalResponsiveProp<'flex' | 'inline-flex'>;
}

const styleParser = compose(
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    spacingSet,
    display,
    backgroundColor,
);

/**
 * A toggle switch for controlling boolean values. Similar to a checkbox.
 *
 * [[ Story id="switch--example" title="Switch example" ]]
 *
 * By default, the Switch component is styled to be full-width (`width="100%"`) with a gray
 * background to match other controls like Select, SelectButtons, Input, etc. This behavior can be
 * overridden using style props. For example, you can set `backgroundColor="transparent"` on the
 * Switch for a transparent background.
 *
 * @docsPath UI/components/Switch
 * @component
 */
const Switch = (props: SwitchProps, ref: React.Ref<HTMLDivElement>) => {
    const {
        disabled,
        id,
        label,
        tabIndex = 0,
        variant = SwitchVariant.default,
        size = ControlSize.default,
        value,
        onClick,
        onChange,
        onMouseEnter,
        onMouseLeave,
        className,
        style,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-labelledby': ariaLabelledBy,
        ...styleProps
    } = props;
    const classNameForStyleProps = useStyledSystem(
        {display: 'flex', width: '100%', ...styleProps},
        styleParser,
    );
    const {
        baseClassName: classNameForVariant,
        switchContainerClassName,
        switchClassName,
        switchLabelClassName,
    } = useSwitchVariant(variant);
    const classNameForSize = useSwitchSize(size);

    if (!label && !ariaLabelledBy && !ariaLabel) {
        // eslint-disable-next-line no-console
        console.warn(
            '<Switch> should be labeled using either the `label`, `ariaLabel`, or `ariaLabelledBy` prop',
        );
    }

    function _onClick(e: React.MouseEvent<HTMLDivElement>) {
        if (onClick) {
            onClick(e);
        }
        _toggleValue();
    }

    function _onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }
        if (['Enter', ' '].includes(e.key)) {
            e.preventDefault();
            _toggleValue();
        }
    }

    function _toggleValue() {
        if (onChange) {
            onChange(!value);
        }
    }

    return (
        <div
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={disabled ? undefined : _onClick}
            onKeyDown={disabled ? undefined : _onKeyDown}
            id={id}
            className={cx(classNameForVariant, classNameForSize, classNameForStyleProps, className)}
            style={style}
            tabIndex={disabled ? undefined : tabIndex}
            role="checkbox"
            aria-disabled={disabled}
            aria-checked={!!value}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
        >
            <div className={switchContainerClassName}>
                <div className={switchClassName} />
            </div>
            {label && <label className={switchLabelClassName}>{label}</label>}
        </div>
    );
};

const ForwardedRefSwitch = React.forwardRef(Switch);

ForwardedRefSwitch.propTypes = {
    value: PropTypes.bool.isRequired,
    ...sharedSwitchPropTypes,
};

ForwardedRefSwitch.displayName = 'Switch';

export default ForwardedRefSwitch;
