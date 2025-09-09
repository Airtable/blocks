/** @module @airtable/blocks/ui: TablePicker */ /** */
import * as React from 'react';
import type Table from '../models/table';
import {type GlobalConfigKey} from '../../shared/types/global_config';
import type Sdk from '../sdk';
import useSynced from '../../shared/ui/use_synced';
import useWatchable from '../../shared/ui/use_watchable';
import {useSdk} from '../../shared/ui/sdk_context';
import {type BaseSdkMode} from '../../sdk_mode';
import TablePicker, {type SharedTablePickerProps} from './table_picker';

/**
 * Props for the {@link TablePickerSynced} component. Also accepts:
 * * {@link SelectStyleProps}
 *
 * @docsPath UI/components/TablePickerSynced
 * @groupPath UI/components/TablePicker
 */
interface TablePickerSyncedProps extends SharedTablePickerProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected table will always reflect the table id stored in {@link GlobalConfig} for this key. Selecting a new table will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/** @hidden */
function _getTableFromGlobalConfigValue(sdk: Sdk, tableId: unknown): Table | null {
    return typeof tableId === 'string' ? sdk.base.getTableByIdIfExists(tableId) : null;
}

/**
 * A wrapper around the {@link TablePicker} component that syncs with {@link GlobalConfig}.
 *
 * [[ Story id="modelpickers--tablepickersynced-example" title="Synced table picker example" ]]
 *
 * @docsPath UI/components/TablePickerSynced
 * @groupPath UI/components/TablePicker
 * @component
 */
const TablePickerSynced = (props: TablePickerSyncedProps, ref: React.Ref<HTMLSelectElement>) => {
    const {globalConfigKey, onChange, disabled, ...restOfProps} = props;
    const [tableId, setTableId, canSetTableId] = useSynced(globalConfigKey);
    const sdk = useSdk<BaseSdkMode>();
    useWatchable(sdk.base, ['tables']);

    return (
        <TablePicker
            {...restOfProps}
            ref={ref}
            table={_getTableFromGlobalConfigValue(sdk, tableId)}
            onChange={(table) => {
                setTableId(table ? table.id : null);
                if (onChange) {
                    onChange(table);
                }
            }}
            disabled={disabled || !canSetTableId}
        />
    );
};

const ForwardedRefTablePickerSynced = React.forwardRef<HTMLSelectElement, TablePickerSyncedProps>(
    TablePickerSynced,
);

ForwardedRefTablePickerSynced.displayName = 'TablePickerSynced';

export default ForwardedRefTablePickerSynced;
