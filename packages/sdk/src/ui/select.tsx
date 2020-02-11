/** @module @airtable/blocks/ui: Select */ /** */
import {cx} from 'emotion';
import * as React from 'react';
import PropTypes from 'prop-types';
import {compose} from '@styled-system/core';
import {createEnum, EnumType} from '../private_utils';
import {spawnError} from '../error_utils';
import useFormFieldId from './use_form_field_id';
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
import {OptionalResponsiveProp} from './system/utils/types';
import useTheme from './theme/use_theme';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import {
    validateOptions,
    optionValueToString,
    stringToOptionValue,
    selectOptionValuePropType,
    SelectOptionValue,
    SelectOption,
} from './select_and_select_buttons_helpers';
import useStyledSystem from './use_styled_system';
import {useSelectSize, ControlSize, ControlSizeProp, controlSizePropType} from './control_sizes';

/** @hidden */
type SelectVariant = EnumType<typeof SelectVariant>;
const SelectVariant = createEnum('default');

/** @internal */
function useSelectVariant(variant: SelectVariant = SelectVariant.default): string {
    const {selectVariants} = useTheme();
    return selectVariants[variant];
}


/**
 * Style props shared between the following components.
 * * {@link Select}, {@link SelectSynced}
 * * {@link TablePicker}, {@link TablePickerSynced}
 * * {@link ViewPicker}, {@link ViewPickerSynced}
 * * {@link FieldPicker}, {@link FieldPickerSynced}
 *
 * Also accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link MaxWidthProps}
 *
 * @noInheritDoc
 */
interface SelectStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: OptionalResponsiveProp<'inline-flex' | 'flex' | 'none'>;
}

/**
 * Props shared between the following components:
 * * {@link Select}, {@link SelectSynced}
 * * {@link TablePicker}, {@link TablePickerSynced}
 * * {@link ViewPicker}, {@link ViewPickerSynced}
 * * {@link FieldPicker}, {@link FieldPickerSynced}
 *
 * @noInheritDoc
 */
export interface SharedSelectBaseProps
    extends TooltipAnchorProps<HTMLSelectElement>,
        SelectStyleProps {
    /** The size of the select. */
    size?: ControlSizeProp;
    /** Additional class names to apply to the select. */
    className?: string;
    /** The `autoFocus` attribute. */
    autoFocus?: boolean;
    /** The `id` attribute. */
    id?: string;
    /** The `name` attribute. */
    name?: string;
    /** The `tabindex` attribute. */
    tabIndex?: number;
    /** If set to `true`, the user cannot interact with the select. */
    disabled?: boolean;
    /** Additional styles to apply to the select. */
    style?: React.CSSProperties;
    /** The `aria-label` attribute. Use this if the select is not referenced by a label element. */
    ['aria-label']?: string;
    /** A space separated list of label element IDs. */
    ['aria-labelledby']?: string;
    /** A space separated list of description element IDs. */
    ['aria-describedby']?: string;
}

export const selectStylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

export const sharedSelectBasePropTypes = {
    size: controlSizePropType,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    ...tooltipAnchorPropTypes,
    ...selectStylePropTypes,
};

/**
 * Props shared between the {@link Select} and {@link SelectSynced} components.
 */
export interface SharedSelectProps extends SharedSelectBaseProps {
    /** The list of select options. */
    options: Array<SelectOption>;
    /** A function to be called when the selected option changes. */
    onChange?: (value: SelectOptionValue) => unknown;
}

export const sharedSelectPropTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: selectOptionValuePropType,
            label: PropTypes.node.isRequired,
            disabled: PropTypes.bool,
        }).isRequired,
    ).isRequired,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
};

/**
 * Props for the {@link Select} component. Also accepts:
 * * {@link SelectStyleProps}
 *
 * @docsPath UI/components/Select
 */
export interface SelectProps extends SharedSelectProps {
    /** The value of the selected option. */
    value: SelectOptionValue;
}

const styleParser = compose(maxWidth, minWidth, width, flexItemSet, positionSet, margin);

/**
 * Dropdown menu component. A wrapper around `<select>` that fits in with Airtable's user interface.
 *
 * [[ Story id="select--example" title="Select example" ]]
 *
 * @component
 * @docsPath UI/components/Select
 */
const Select = (props: SelectProps, ref: React.Ref<HTMLSelectElement>) => {
    const {
        size = ControlSize.default,
        value,
        options: originalOptions = [],
        autoFocus,
        disabled,
        id,
        name,
        tabIndex,
        onChange,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        className,
        style,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-labelledby': ariaLabelledBy,
        ...styleProps
    } = props;
    const formFieldId = useFormFieldId();
    const classNameForSelectVariant = useSelectVariant();
    const classNameForSelectSize = useSelectSize(size);
    const classNameForStyleProps = useStyledSystem(
        {
            width: '100%',
            ...styleProps,
        },
        styleParser,
    );

    function _onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (onChange) {
            const newValue = stringToOptionValue(e.currentTarget.value);
            onChange(newValue);
        }
    }

    const validationResult = validateOptions(originalOptions);
    if (!validationResult.isValid) {
        throw spawnError('<Select> %s', validationResult.reason);
    }

    let didFindOptionMatchingValue = false;
    for (const option of originalOptions) {
        if (option.value === value) {
            didFindOptionMatchingValue = true;
            break;
        }
    }
    const options = [];
    if (!didFindOptionMatchingValue) {
        options.push({
            label: '',
            value,
            disabled: true,
        });
        // eslint-disable-next-line no-console
        console.warn(`No option for selected value in <Select>: ${String(value)}`.substr(0, 100));
    }
    options.push(...originalOptions);

    return (
        <select
            ref={ref}
            value={optionValueToString(value)}
            onChange={_onChange}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            autoFocus={autoFocus}
            disabled={disabled}
            id={id || formFieldId}
            name={name}
            tabIndex={tabIndex}
            className={cx(
                classNameForSelectVariant,
                classNameForSelectSize,
                classNameForStyleProps,
                className,
            )}
            style={style}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
        >
            {options.map(option => {
                const valueJson = optionValueToString(option.value);
                return (
                    <option key={valueJson} value={valueJson} disabled={option.disabled}>
                        {option.label}
                    </option>
                );
            })}
        </select>
    );
};

const ForwardedRefSelect = React.forwardRef<HTMLSelectElement, SelectProps>(Select);

ForwardedRefSelect.displayName = 'Select';

ForwardedRefSelect.propTypes = {
    value: selectOptionValuePropType,
    ...sharedSelectPropTypes,
};

export default ForwardedRefSelect;
