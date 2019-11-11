/** @module @airtable/blocks/ui: TablePicker */ /** */
import * as React from 'react';
import getSdk from '../get_sdk';
import Table from '../models/table';
import {GlobalConfigKey} from '../global_config';
import TablePicker, {sharedTablePickerPropTypes, SharedTablePickerProps} from './table_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import useSynced from './use_synced';
import useWatchable from './use_watchable';

/**
 * Props for the {@link TablePickerSynced} component. Also accepts:
 * * {@link SharedTablePickerProps}
 *
 * @noInheritDoc
 */
interface TablePickerSyncedProps extends SharedTablePickerProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected table will always reflect the table id stored in {@link GlobalConfig} for this key. Selecting a new table will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/** @hidden */
function _getTableFromGlobalConfigValue(tableId: unknown): Table | null {
    return typeof tableId === 'string' ? getSdk().base.getTableByIdIfExists(tableId) : null;
}

/**
 * A wrapper around the {@link TablePicker} component that syncs with {@link GlobalConfig}.
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
function TablePickerSynced(props: TablePickerSyncedProps, ref: React.Ref<HTMLSelectElement>) {
    const {globalConfigKey, onChange, disabled, ...restOfProps} = props;
    const {value: tableId, canSetValue: canSetTableId, setValue: setTableId} = useSynced(
        globalConfigKey,
    );
    useWatchable(getSdk().base, ['tables']);

    return (
        <TablePicker
            {...restOfProps}
            ref={ref}
            table={_getTableFromGlobalConfigValue(tableId)}
            onChange={table => {
                setTableId(table ? table.id : null);
                if (onChange) {
                    onChange(table);
                }
            }}
            disabled={disabled || !canSetTableId}
        />
    );
}

const ForwardedRefTablePickerSynced = React.forwardRef<HTMLSelectElement, TablePickerSyncedProps>(
    TablePickerSynced,
);

ForwardedRefTablePickerSynced.displayName = 'TablePickerSynced';

ForwardedRefTablePickerSynced.propTypes = {
    globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
    ...sharedTablePickerPropTypes,
};

export default ForwardedRefTablePickerSynced;
