/** @module @airtable/blocks/ui: ViewPicker */ /** */
import * as React from 'react';
import {spawnInvariantViolationError} from '../error_utils';
import getSdk from '../get_sdk';
import View from '../models/view';
import {GlobalConfigKey} from '../global_config';
import {ReactRefType} from '../private_utils';
import ViewPicker, {sharedViewPickerPropTypes, SharedViewPickerProps} from './view_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

/**
 * @typedef {object} ViewPickerSyncedProps
 */
interface ViewPickerSyncedProps extends SharedViewPickerProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected view will always reflect the view id stored in `globalConfig` for this key. Selecting a new view will update `globalConfig`. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * Dropdown menu component for selecting views, synced with {@link GlobalConfig}.
 *
 * @example
 * ```js
 * import {TablePickerSynced, ViewPickerSynced, useBase, useRecords, useWatchable} from '@airtable/blocks/ui';
 * import {viewTypes} from '@airtable/blocks/models';
 * import {globalConfig} from '@airtable/blocks';
 * import React, {Fragment} from 'react';
 *
 * function Block() {
 *     const base = useBase();
 *     const tableId = globalConfig.get('tableId');
 *     const table = base.getTableByIdIfExists(tableId);
 *     const viewId = globalConfig.get('viewId');
 *     const view = table.getViewByIdIfExists(viewId);
 *     const queryResult = view ? view.selectRecords() : null;
 *     const records = useRecords(queryResult);
 *     useWatchable(globalConfig, ['tableId', 'viewId']);
 *
 *     const summaryText = view ? `${view.name} has ${records.length} record(s).` : 'No view selected.';
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
 *                     <div style={{marginBottom: 8, fontWeight: 500}}>View</div>
 *                     <ViewPickerSynced
 *                         table={table}
 *                         globalConfigKey='viewId'
 *                         allowedTypes={[viewTypes.GRID]}
 *                         shouldAllowPickingNone={true}
 *                     />
 *                 </label>
 *             )}
 *         </Fragment>
 *     );
 * }
 * ```
 */
export class ViewPickerSynced extends React.Component<ViewPickerSyncedProps> {
    /** @hidden */
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedViewPickerPropTypes,
    };
    /** @internal */
    _viewPicker: ReactRefType<typeof ViewPicker> | null;
    /** @hidden */
    constructor(props: ViewPickerSyncedProps) {
        super(props);
        // TODO (stephen): Use React.forwardRef
        this._viewPicker = null;
    }
    /** */
    focus() {
        if (!this._viewPicker) {
            throw spawnInvariantViolationError('No view picker to focus');
        }
        this._viewPicker.focus();
    }
    /** */
    blur() {
        if (!this._viewPicker) {
            throw spawnInvariantViolationError('No view picker to blur');
        }
        this._viewPicker.blur();
    }
    /** */
    click() {
        if (!this._viewPicker) {
            throw spawnInvariantViolationError('No view picker to click');
        }
        this._viewPicker.click();
    }
    /** @internal */
    _getViewFromGlobalConfigValue(viewId: unknown): View | null {
        const {table} = this.props;
        if (!table || table.isDeleted) {
            return null;
        }
        return typeof viewId === 'string' && table ? table.getViewByIdIfExists(viewId) : null;
    }
    /** @hidden */
    render() {
        const {globalConfigKey, table, onChange, disabled, ...restOfProps} = this.props;
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <ViewPicker
                        {...restOfProps}
                        ref={el => (this._viewPicker = el)}
                        table={table}
                        view={this._getViewFromGlobalConfigValue(value)}
                        onChange={view => {
                            setValue(view ? view.id : null);
                            if (onChange) {
                                onChange(view);
                            }
                        }}
                        disabled={disabled || !canSetValue}
                    />
                )}
            />
        );
    }
}

export default withHooks<{}, ViewPickerSyncedProps, ViewPickerSynced>(ViewPickerSynced, props => {
    useWatchable(getSdk().base, ['tables']);
    useWatchable(props.table, ['views']);
    return {};
});
