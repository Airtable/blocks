// @flow
import * as React from 'react';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import type View from '../models/view';
import {type GlobalConfigKey} from '../global_config';
import ViewPicker, {sharedViewPickerPropTypes, type SharedViewPickerProps} from './view_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

/**
 * @typedef {object} ViewPickerSyncedProps
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The selected view will always reflect the view id stored in `globalConfig` for this key. Selecting a new view will update `globalConfig`.
 * @property {Table} [table] The parent table model to select views from. If `null` or `undefined`, the picker won't render.
 * @property {Array.<ViewType>} [allowedTypes] An array indicating which view types can be selected.
 * @property {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected view.
 * @property {string} [placeholder='Pick a view...'] The placeholder text when no view is selected.
 * @property {function} [onChange] A function to be called when the selected view changes. This should only be used for side effects.
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
type ViewPickerSyncedProps = {|
    globalConfigKey: GlobalConfigKey,
    ...SharedViewPickerProps,
|};

/**
 * Dropdown menu component for selecting views, synced with {@link GlobalConfig}.
 *
 * @example
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
 */
class ViewPickerSynced extends React.Component<ViewPickerSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedViewPickerPropTypes,
    };
    props: ViewPickerSyncedProps;
    _viewPicker: React.ElementRef<typeof ViewPicker> | null;
    constructor(props: ViewPickerSyncedProps) {
        super(props);
        this._viewPicker = null;
    }
    focus() {
        invariant(this._viewPicker, 'No view picker to focus');
        this._viewPicker.focus();
    }
    blur() {
        invariant(this._viewPicker, 'No view picker to blur');
        this._viewPicker.blur();
    }
    click() {
        invariant(this._viewPicker, 'No view picker to click');
        this._viewPicker.click();
    }
    _getViewFromGlobalConfigValue(viewId: mixed): View | null {
        const {table} = this.props;
        if (!table || table.isDeleted) {
            return null;
        }
        return typeof viewId === 'string' && table ? table.getViewByIdIfExists(viewId) : null;
    }
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

export default withHooks<ViewPickerSyncedProps, {}, ViewPickerSynced>(ViewPickerSynced, props => {
    useWatchable(getSdk().base, ['tables']);
    useWatchable(props.table, ['views']);
    return {};
});
