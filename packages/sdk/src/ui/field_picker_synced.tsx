/** @module @airtable/blocks/ui: FieldPicker */ /** */
import * as React from 'react';
import getSdk from '../get_sdk';
import Field from '../models/field';
import {GlobalConfigKey} from '../global_config';
import {spawnInvariantViolationError} from '../error_utils';
import {ReactRefType} from '../private_utils';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import FieldPicker, {sharedFieldPickerPropTypes, SharedFieldPickerProps} from './field_picker';
import Synced from './synced';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

/**
 * @typedef {object} FieldPickerSyncedProps
 */
interface FieldPickerSyncedProps extends SharedFieldPickerProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected field will always reflect the field id stored in `globalConfig` for this key. Selecting a new field will update `globalConfig`. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * Dropdown menu component for selecting fields, synced with {@link GlobalConfig}.
 *
 * @example
 * ```js
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
 * ```
 */
export class FieldPickerSynced extends React.Component<FieldPickerSyncedProps> {
    /** @hidden */
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedFieldPickerPropTypes,
    };
    /** @internal */
    _fieldPicker: ReactRefType<typeof FieldPicker> | null;
    /** @hidden */
    constructor(props: FieldPickerSyncedProps) {
        super(props);
        // TODO (sReactRefType React.forwardRef
        this._fieldPicker = null;
    }
    /** */
    focus() {
        if (!this._fieldPicker) {
            throw spawnInvariantViolationError('No field picker to focus');
        }
        this._fieldPicker.focus();
    }
    /** */
    blur() {
        if (!this._fieldPicker) {
            throw spawnInvariantViolationError('No field picker to blur');
        }
        this._fieldPicker.blur();
    }
    /** */
    click() {
        if (!this._fieldPicker) {
            throw spawnInvariantViolationError('No field picker to click');
        }
        this._fieldPicker.click();
    }
    /** @internal */
    _getFieldFromGlobalConfigValue(fieldId: unknown): Field | null {
        const {table} = this.props;
        if (!table || table.isDeleted) {
            return null;
        }
        return typeof fieldId === 'string' && table ? table.getFieldByIdIfExists(fieldId) : null;
    }
    /** @hidden */
    render() {
        const {globalConfigKey, onChange, disabled, ...restOfProps} = this.props;
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <FieldPicker
                        {...restOfProps}
                        ref={el => (this._fieldPicker = el)}
                        field={this._getFieldFromGlobalConfigValue(value)}
                        onChange={field => {
                            setValue(field ? field.id : null);
                            if (onChange) {
                                onChange(field);
                            }
                        }}
                        disabled={disabled || !canSetValue}
                    />
                )}
            />
        );
    }
}

export default withHooks<{}, FieldPickerSyncedProps, FieldPickerSynced>(
    FieldPickerSynced,
    props => {
        useWatchable(getSdk().base, ['tables']);
        useWatchable(props.table, ['fields']);
        return {};
    },
);
