/** @module @airtable/blocks/ui: Select */ /** */
import {cx} from 'emotion';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {compose} from '@styled-system/core';
import {spawnError} from '../error_utils';
import {baymax} from './baymax_utils';
import {
    validateOptions,
    optionValueToString,
    selectOptionValuePropType,
    SelectOption,
    SelectOptionValue,
} from './select_and_select_buttons_helpers';
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
    margin,
    marginPropTypes,
    MarginProps,
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import Box from './box';

// Shared with `SelectButtons` and `SelectButtonsSynced`.
/** */
export interface SharedSelectButtonsProps extends TooltipAnchorProps {
    /** The list of select options. */
    options: Array<SelectOption>;
    /** A function to be called when the selected option changes. */
    onChange?: (value: SelectOptionValue) => void;
    /** If set to `true`, the user cannot interact with the select. */
    disabled?: boolean;
    /** Additional class names to apply to the select. */
    className?: string;
    /** The `tabindex` attribute. */
    tabIndex?: number;
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
    // We do more strict checks in render.
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: selectOptionValuePropType,
            label: PropTypes.node.isRequired,
            disabled: PropTypes.bool,
        }).isRequired,
    ).isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    ...tooltipAnchorPropTypes,
};

/** */
export interface SelectButtonsStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {}

const styleParser = compose(
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    margin,
);

export const selectButtonsStylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/**
 * @typedef {object} SelectButtonsProps
 */
interface SelectButtonsProps extends SharedSelectButtonsProps, SelectButtonsStyleProps {
    /** The value of the selected option. */
    value: SelectOptionValue;
}

/** */
function SelectButtons(props: SelectButtonsProps, ref: React.Ref<HTMLDivElement>) {
    const {
        className,
        style,
        options,
        disabled,
        value,
        tabIndex = 0,
        onChange,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-labelledby': ariaLabelledBy,
        ...styleProps
    } = props;

    const classNameForStyleProps = useStyledSystem({width: '100%', ...styleProps}, styleParser);

    useEffect(() => {
        // Check options here for a cleaner stack trace.
        // Also, even though options are required, still check if it's set because
        // the error is really ugly and covers up the prop type check.
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

    function _onKeyDown(e: React.KeyboardEvent<HTMLDivElement>, newValue: SelectOptionValue) {
        if ([' ', 'Enter'].includes(e.key)) {
            _onChange(newValue);
        }
    }

    return (
        <Box
            // TODO (stephen): remove tooltip anchor props
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={cx(classNameForStyleProps, className)}
            style={style}
            display="flex"
            padding={1}
            backgroundColor="darken2"
            borderRadius="default"
            opacity={disabled ? 'quieter' : 'normal'}
            overflow="hidden"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
        >
            {options &&
                options.map(option => {
                    const isSelected = option.value === value;
                    const isOptionDisabled = disabled || option.disabled;
                    return (
                        <div
                            key={optionValueToString(option.value)}
                            onClick={isOptionDisabled ? undefined : () => _onChange(option.value)}
                            onKeyDown={
                                isOptionDisabled ? undefined : e => _onKeyDown(e, option.value)
                            }
                            tabIndex={isOptionDisabled ? -1 : tabIndex}
                            className={cx(
                                baymax('flex-auto rounded p-half normal center no-outline'),
                                {
                                    [baymax('link-unquiet pointer focusable')]: !isOptionDisabled,
                                    [baymax('darken4 text-white')]: isSelected,
                                    [baymax('text-dark')]: !isSelected,
                                    [baymax('quiet')]: !isSelected && !disabled,
                                },
                            )}
                            style={{
                                flexBasis: 0,
                            }}
                        >
                            {option.label}
                        </div>
                    );
                })}
        </Box>
    );
}

const ForwardedRefSelectButtons = React.forwardRef(SelectButtons);

ForwardedRefSelectButtons.propTypes = {
    value: selectOptionValuePropType,
    ...sharedSelectButtonsPropTypes,
    ...selectButtonsStylePropTypes,
};

ForwardedRefSelectButtons.displayName = 'SelectButtons';

export default ForwardedRefSelectButtons;
