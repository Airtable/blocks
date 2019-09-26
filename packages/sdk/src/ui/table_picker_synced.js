// @flow
import * as React from 'react';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import type Table from '../models/table';
import {type GlobalConfigKey} from '../global_config';
import TablePicker, {sharedTablePickerPropTypes, type SharedTablePickerProps} from './table_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

/**
 * @typedef {object} TablePickerSyncedProps
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The selected table will always reflect the table id stored in `globalConfig` for this key. Selecting a new table will update `globalConfig`.
 * @property {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected table.
 * @property {string} [placeholder='Pick a table...'] The placeholder text when no table is selected.
 * @property {function} [onChange] A function to be called when the selected table changes. This should only be used for side effects.
 * @property {string} [autoFocus] The `autoFocus` attribute.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the picker.
 * @property {string} [id] The `id` attribute.
 * @property {string} [name] The `name` attribute.
 * @property {number | string} [tabIndex] The `tabindex` attribute.
 * @property {string} [className] Additional class names to apply to the picker.
 * @property {object} [style] Additional styles to apply to the picker.
 * @property {string} [aria-label] The `aria-label` attribute. Use this if the select is not referenced by a label element.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type TablePickerSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    ...SharedTablePickerProps,
};

/**
 * Dropdown menu component for selecting tables, synced with {@link GlobalConfig}.
 *
 * @example
 * import {TablePickerSynced, useBase, useRecords, useWatchable} from '@airtable/blocks/ui';
 * import {globalConfig} from '@airtable/blocks';
 * import React, {Fragment} from 'react';
 *
 * function Block() {
 *     const base = useBase();
 *     const tableId = globalConfig.get('tableId');
 *     const table = base.getTableByIdIfExists(tableId);
 *     const queryResult = table ? table.selectRecords() : null;
 *     const records = useRecords(queryResult);
 *     useWatchable(globalConfig, ['tableId']);
 *
 *     const summaryText = table ? `${table.name} has ${records.length} record(s).` : 'No table selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePickerSynced
 *                     globalConfigKey="tableId"
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *         </Fragment>
 *     );
 * }
 */
class TablePickerSynced extends React.Component<TablePickerSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedTablePickerPropTypes,
    };
    props: TablePickerSyncedProps;
    _tablePicker: React.ElementRef<typeof TablePicker> | null;
    constructor(props: TablePickerSyncedProps) {
        super(props);
        this._tablePicker = null;
    }
    focus() {
        invariant(this._tablePicker, 'No table picker to focus');
        this._tablePicker.focus();
    }
    blur() {
        invariant(this._tablePicker, 'No table picker to blur');
        this._tablePicker.blur();
    }
    click() {
        invariant(this._tablePicker, 'No table picker to click');
        this._tablePicker.click();
    }
    _getTableFromGlobalConfigValue(tableId: mixed): Table | null {
        return typeof tableId === 'string' ? getSdk().base.getTableByIdIfExists(tableId) : null;
    }
    render() {
        const {globalConfigKey, onChange, disabled, ...restOfProps} = this.props;
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <TablePicker
                        {...restOfProps}
                        ref={el => (this._tablePicker = el)}
                        table={this._getTableFromGlobalConfigValue(value)}
                        onChange={table => {
                            setValue(table ? table.id : null);
                            if (onChange) {
                                onChange(table);
                            }
                        }}
                        disabled={disabled || !canSetValue}
                    />
                )}
            />
        );
    }
}

export default withHooks<TablePickerSyncedProps, {}, TablePickerSynced>(TablePickerSynced, () => {
    useWatchable(getSdk().base, ['tables']);
    return {};
});
