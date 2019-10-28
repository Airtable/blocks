/** @module @airtable/blocks/ui: TablePicker */ /** */
import * as React from 'react';
import {spawnInvariantViolationError} from '../error_utils';
import getSdk from '../get_sdk';
import Table from '../models/table';
import {GlobalConfigKey} from '../global_config';
import {ReactRefType} from '../private_utils';
import TablePicker, {sharedTablePickerPropTypes, SharedTablePickerProps} from './table_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

/**
 * @typedef {object} TablePickerSyncedProps
 */
interface TablePickerSyncedProps extends SharedTablePickerProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected table will always reflect the table id stored in `globalConfig` for this key. Selecting a new table will update `globalConfig`. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * Dropdown menu component for selecting tables, synced with {@link GlobalConfig}.
 *
 * @example
 * ```js
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
 * ```
 */
export class TablePickerSynced extends React.Component<TablePickerSyncedProps> {
    /** @hidden */
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedTablePickerPropTypes,
    };
    /** @internal */
    _tablePicker: ReactRefType<typeof TablePicker> | null;
    /** @hidden */
    constructor(props: TablePickerSyncedProps) {
        super(props);
        // TODO (stephen): use React.forwardRef
        this._tablePicker = null;
    }
    /** */
    focus() {
        if (!this._tablePicker) {
            throw spawnInvariantViolationError('No table picker to focus');
        }
        this._tablePicker.focus();
    }
    /** */
    blur() {
        if (!this._tablePicker) {
            throw spawnInvariantViolationError('No table picker to blur');
        }
        this._tablePicker.blur();
    }
    /** */
    click() {
        if (!this._tablePicker) {
            throw spawnInvariantViolationError('No table picker to click');
        }
        this._tablePicker.click();
    }
    /** @internal */
    _getTableFromGlobalConfigValue(tableId: unknown): Table | null {
        return typeof tableId === 'string' ? getSdk().base.getTableByIdIfExists(tableId) : null;
    }
    /** @hidden */
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

export default withHooks<{}, TablePickerSyncedProps, TablePickerSynced>(TablePickerSynced, () => {
    useWatchable(getSdk().base, ['tables']);
    return {};
});
