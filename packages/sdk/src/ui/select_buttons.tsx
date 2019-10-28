/** @module @airtable/blocks/ui: Select */ /** */
import {cx} from 'emotion';
import * as React from 'react';
import PropTypes from 'prop-types';
import {compose} from '@styled-system/core';
import {spawnError} from '../error_utils';
import {baymax} from './baymax_utils';
import {
    validateOptions,
    optionValueToString,
    SelectOptionValuePropType,
    SelectOption,
    SelectOptionValue,
} from './select_and_select_buttons_helpers';
import withStyledSystem from './with_styled_system';
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
import {KeyCodes} from './key_codes';

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
            value: SelectOptionValuePropType,
            label: PropTypes.node,
            disabled: PropTypes.bool,
        }),
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
interface SelectButtonsProps extends SharedSelectButtonsProps {
    /** The value of the selected option. */
    value: SelectOptionValue;
}

/** */
export class SelectButtons extends React.Component<SelectButtonsProps> {
    /** @hidden */
    static propTypes = {
        value: SelectOptionValuePropType,
        ...sharedSelectButtonsPropTypes,
    };
    /** @internal */
    _onChange(newValue: SelectOptionValue) {
        const {value, onChange} = this.props;
        if (onChange) {
            if (newValue !== value) {
                onChange(newValue);
            }
        }
    }
    /** @internal */
    _onKeyDown(e: React.KeyboardEvent<HTMLDivElement>, value: SelectOptionValue) {
        if (e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) {
            this._onChange(value);
        }
    }
    /** @hidden */
    render() {
        const {
            className,
            style,
            options,
            disabled,
            value,
            onMouseEnter,
            onMouseLeave,
            onClick,
            tabIndex = 0,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedBy,
            'aria-labelledby': ariaLabelledBy,
        } = this.props;

        // Check options here for a cleaner stack trace.
        // Also, even though options are required, still check if it's set because
        // the error is really ugly and covers up the prop type check.
        const validationResult = validateOptions(options);
        if (!validationResult.isValid) {
            throw spawnError('<SelectButtons> %s', validationResult.reason);
        }

        return (
            <Box
                // TODO (stephen): remove tooltip anchor props
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                className={className}
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
                                onClick={
                                    isOptionDisabled
                                        ? undefined
                                        : () => this._onChange(option.value)
                                }
                                onKeyDown={
                                    isOptionDisabled
                                        ? undefined
                                        : e => this._onKeyDown(e, option.value)
                                }
                                tabIndex={isOptionDisabled ? -1 : tabIndex}
                                className={cx(
                                    baymax('flex-auto rounded p-half normal center no-outline'),
                                    {
                                        [baymax(
                                            'link-unquiet pointer focusable',
                                        )]: !isOptionDisabled,
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
}

export default withStyledSystem<SelectButtonsProps, SelectButtonsStyleProps, SelectButtons, {}>(
    SelectButtons,
    styleParser,
    selectButtonsStylePropTypes,
    {
        width: '100%',
    },
);
