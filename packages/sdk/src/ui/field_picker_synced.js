// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import Table from '../models/table';
import getSdk from '../get_sdk';
import {FieldTypes, type FieldType} from '../types/field';
import type Field from '../models/field';
import {type GlobalConfigKey} from '../global_config';
import {values} from '../private_utils';
import {invariant} from '../error_utils';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import FieldPicker from './field_picker';
import Synced from './synced';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

/**
 * @typedef {object} FieldPickerSyncedProps
 * @property {Table} [table] The parent table model to select fields from. If `null` or `undefined`, the picker won't render.
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The selected field will always reflect the field id stored in `globalConfig` for this key. Selecting a new field will update `globalConfig`.
 * @property {function} [onChange] A function to be called when the selected field changes. This should only be used for side effects.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the picker.
 * @property {Array.<FieldType>} [allowedTypes] An array indicating which field types can be selected.
 * @property {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected field.
 * @property {string} [placeholder='Pick a field...'] The placeholder text when no field is selected.
 * @property {string} [id] The ID of the picker element.
 * @property {string} [className] Additional class names to apply to the picker.
 * @property {object} [style] Additional styles to apply to the picker.
 * @property {number | string} [tabIndex] Indicates if the picker can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type FieldPickerSyncedProps = {
    table?: Table | null,
    globalConfigKey: GlobalConfigKey,
    onChange?: (fieldModel: Field | null) => void,
    disabled?: boolean,

    allowedTypes?: Array<FieldType>,
    shouldAllowPickingNone?: boolean,
    placeholder?: string,
    id?: string,
    className?: string,
    style?: Object,
    tabIndex?: number | string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
};

/**
 * Dropdown menu component for selecting fields, synced with {@link GlobalConfig}.
 *
 * @example
 * import {TablePickerSynced, FieldPickerSynced, useBase, useWatchable} from '@airtable/blocks/ui';
 * import {fieldTypes} from '@airtable/blocks/models';
 * import {globalConfig} from '@airtable/blocks';
 * import React, {Fragment} from 'react';
 *
 * function Block() {
 *     const base = useBase();
 *     const tableId = globalConfig.get('tableId');
 *     const table = base.getTableByIdIfExists(tableId);
 *     const fieldId = globalConfig.get('fieldId');
 *     const field = table.getFieldByIdIfExists(fieldId);
 *     useWatchable(globalConfig, ['tableId', 'fieldId']);
 *
 *     const summaryText = field ? `The field type for ${field.name} is ${field.type}.` : 'No field selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label style={{display: 'block', marginBottom: 16}}>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePickerSynced
 *                     globalConfigKey='tableId'
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *             {table && (
 *                 <label>
 *                     <div style={{marginBottom: 8, fontWeight: 500}}>Field</div>
 *                     <FieldPickerSynced
 *                         table={table}
 *                         globalConfigKey='fieldId'
 *                         allowedTypes={[
 *                             fieldTypes.SINGLE_LINE_TEXT,
 *                             fieldTypes.MULTILINE_TEXT,
 *                             fieldTypes.EMAIL,
 *                             fieldTypes.URL,
 *                             fieldTypes.PHONE_NUMBER,
 *                         ]}
 *                         shouldAllowPickingNone={true}
 *                     />
 *                 </label>
 *             )}
 *         </Fragment>
 *     );
 * }
 */
class FieldPickerSynced extends React.Component<FieldPickerSyncedProps> {
    static propTypes = {
        table: PropTypes.instanceOf(Table),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,

        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(FieldTypes))),
        shouldAllowPickingNone: PropTypes.bool,
        placeholder: PropTypes.string,
        id: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
        'aria-labelledby': PropTypes.string,
        'aria-describedby': PropTypes.string,
    };
    props: FieldPickerSyncedProps;
    _fieldPicker: React.ElementRef<typeof FieldPicker> | null;
    constructor(props: FieldPickerSyncedProps) {
        super(props);
        this._fieldPicker = null;
    }
    focus() {
        invariant(this._fieldPicker, 'No field picker to focus');
        this._fieldPicker.focus();
    }
    blur() {
        invariant(this._fieldPicker, 'No field picker to blur');
        this._fieldPicker.blur();
    }
    click() {
        invariant(this._fieldPicker, 'No field picker to click');
        this._fieldPicker.click();
    }
    _getFieldFromGlobalConfigValue(fieldId: mixed): Field | null {
        const {table} = this.props;
        if (!table || table.isDeleted) {
            return null;
        }
        return typeof fieldId === 'string' && table ? table.getFieldByIdIfExists(fieldId) : null;
    }
    render() {
        const {
            table,
            globalConfigKey,
            onChange,
            disabled,
            allowedTypes,
            shouldAllowPickingNone,
            placeholder,
            id,
            className,
            style,
            tabIndex,
        } = this.props;
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <FieldPicker
                        ref={el => (this._fieldPicker = el)}
                        table={table}
                        field={this._getFieldFromGlobalConfigValue(value)}
                        onChange={field => {
                            setValue(field ? field.id : null);
                            if (onChange) {
                                onChange(field);
                            }
                        }}
                        disabled={disabled || !canSetValue}
                        allowedTypes={allowedTypes}
                        shouldAllowPickingNone={shouldAllowPickingNone}
                        placeholder={placeholder}
                        id={id}
                        className={className}
                        style={style}
                        tabIndex={tabIndex}
                        aria-labelledby={this.props['aria-labelledby']}
                        aria-describedby={this.props['aria-describedby']}
                    />
                )}
            />
        );
    }
}

export default withHooks<FieldPickerSyncedProps, {}, FieldPickerSynced>(
    FieldPickerSynced,
    props => {
        useWatchable(getSdk().base, ['tables']);
        useWatchable(props.table, ['fields']);
        return {};
    },
);
