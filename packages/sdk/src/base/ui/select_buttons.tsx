/** @module @airtable/blocks/ui: SelectButtons */ /** */
import {cx} from 'emotion';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {compose} from '@styled-system/core';
import {spawnError} from '../../shared/error_utils';
import {createEnum, EnumType, getLocallyUniqueId} from '../../shared/private_utils';
import {
    validateOptions,
    optionValueToString,
    selectOptionValuePropType,
    SelectOption,
    SelectOptionValue,
} from './select_and_select_buttons_helpers';
import useStyledSystem from './use_styled_system';
import useTheme from './theme/use_theme';
import cssHelpers from './css_helpers';
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
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import {
    ControlSizeProp,
    controlSizePropType,
    ControlSize,
    useSelectButtonsSize,
} from './control_sizes';

/** @internal */
type SelectButtonsVariant = EnumType<typeof SelectButtonsVariant>;
const SelectButtonsVariant = createEnum('default');

/** @internal */
function useSelectButtonsVariant(variant: SelectButtonsVariant = SelectButtonsVariant.default) {
    const {selectButtonsVariants} = useTheme();
    return selectButtonsVariants[variant];
}

/**
 * Style props shared between the {@link SelectButtons} and {@link SelectButtonsSynced} components. Accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
export interface SelectButtonsStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {}

const styleParser = compose(maxWidth, minWidth, width, flexItemSet, positionSet, margin);

export const selectButtonsStylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/**
 * Props shared between the {@link SelectButtons} and {@link SelectButtonsSynced} components.
 *
 * @noInheritDoc
 */
export interface SharedSelectButtonsProps extends SelectButtonsStyleProps, TooltipAnchorProps {
    /** The list of select options. */
    options: Array<SelectOption>;
    /** A function to be called when the selected option changes. */
    onChange?: (value: SelectOptionValue) => void;
    /** If set to `true`, the user cannot interact with the select. */
    disabled?: boolean;
    /** Additional class names to apply to the select. */
    className?: string;
    /** The size of the select buttons. */
    size?: ControlSizeProp;
    /** Additional styles to apply to the select. */
    style?: React.CSSProperties;
    /** The `aria-label` attribute. Use this if the select is not referenced by a label element. */
    ['aria-label']?: string;
    /** A space separated list of label element IDs. */
    ['aria-labelledby']?: string;
    /** A space separated list of description element IDs. */
    ['aria-describedby']?: string;
}

export const sharedSelectButtonsPropTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: selectOptionValuePropType,
            label: PropTypes.node.isRequired,
            disabled: PropTypes.bool,
        }).isRequired,
    ).isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    size: controlSizePropType,
    className: PropTypes.string,
    style: PropTypes.object,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    ...selectButtonsStylePropTypes,
    ...tooltipAnchorPropTypes,
    ...selectButtonsStylePropTypes,
};

/**
 * Props for the {@link SelectButtons} component. Also accepts:
 * * {@link SelectButtonsStyleProps}
 *
 * @docsPath UI/components/SelectButtons
 */
export interface SelectButtonsProps extends SharedSelectButtonsProps {
    /** The value of the selected option. */
    value: SelectOptionValue;
}

/**
 * A segmented control for selecting one value from a set of options.
 *
 * [[ Story id="selectbuttons--example" title="Select buttons example" ]]
 *
 * @docsPath UI/components/SelectButtons
 * @component
 */
const SelectButtons = (props: SelectButtonsProps, ref: React.Ref<HTMLDivElement>) => {
    const {
        className,
        style,
        options,
        disabled,
        value,
        size = ControlSize.default,
        onChange,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        'aria-describedby': ariaDescribedBy,
        'aria-labelledby': ariaLabelledBy,
        ...styleProps
    } = props;
    const {containerClassNameForVariant, optionClassNameForVariant} = useSelectButtonsVariant();
    const containerClassNameForSize = useSelectButtonsSize(size);
    const classNameForStyleProps = useStyledSystem({width: '100%', ...styleProps}, styleParser);
    const [generatedId] = useState(getLocallyUniqueId('sb-'));
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const validationResult = validateOptions(options);
        if (!validationResult.isValid) {
            throw spawnError('<SelectButtons> %s', validationResult.reason);
        }
    }, [options]);

    function _onChange(newValue: SelectOptionValue) {
        if (onChange) {
            if (newValue !== value) {
                onChange(newValue);
            }
        }
    }

    return (
        <div
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cx(
                containerClassNameForSize,
                containerClassNameForVariant,
                classNameForStyleProps,
                className,
            )}
            style={style}
            data-disabled={disabled}
            data-focused={isFocused}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
        >
            {options.map((option, index) => {
                const isSelected = option.value === value;
                const isOptionDisabled = disabled || option.disabled;
                const radioId = `${generatedId}-${index}`;
                const valueJson = optionValueToString(option.value);
                return (
                    <div
                        key={`${valueJson}-${option.label}-${index}`}
                        className={optionClassNameForVariant}
                    >
                        <input
                            type="radio"
                            onChange={isOptionDisabled ? undefined : () => _onChange(option.value)}
                            disabled={!!isOptionDisabled}
                            checked={isSelected}
                            className={cssHelpers.VISUALLY_HIDDEN}
                            id={radioId}
                            name={generatedId}
                        />
                        <label htmlFor={radioId}>
                            <span className={cssHelpers.TRUNCATE}>{option.label}</span>
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

const ForwardedRefSelectButtons = React.forwardRef<HTMLDivElement, SelectButtonsProps>(
    SelectButtons,
);

ForwardedRefSelectButtons.propTypes = {
    value: selectOptionValuePropType,
    ...sharedSelectButtonsPropTypes,
};

ForwardedRefSelectButtons.displayName = 'SelectButtons';

export default ForwardedRefSelectButtons;
