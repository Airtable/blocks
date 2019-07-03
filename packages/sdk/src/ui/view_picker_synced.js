// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {values} from '../private_utils';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import Table from '../models/table';
import {ViewTypes, type ViewType} from '../types/view';
import type View from '../models/view';
import {type GlobalConfigKey} from '../global_config';
import ViewPicker from './view_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

/**
 * @typedef {object} ViewPickerSyncedProps
 * @property {Table} [table] The parent table model to select views from. If `null` or `undefined`, the picker won't render.
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The selected view will always reflect the view id stored in `globalConfig` for this key. Selecting a new view will update `globalConfig`.
 * @property {function} [onChange] A function to be called when the selected view changes. This should only be used for side effects.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the picker.
 * @property {Array.<ViewType>} [allowedTypes] An array indicating which view types can be selected.
 * @property {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected view.
 * @property {string} [placeholder='Pick a view...'] The placeholder text when no view is selected.
 * @property {string} [id] The ID of the picker element.
 * @property {string} [className] Additional class names to apply to the picker.
 * @property {object} [style] Additional styles to apply to the picker.
 * @property {number | string} [tabIndex] Indicates if the picker can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type ViewPickerSyncedProps = {
    table?: Table | null,
    globalConfigKey: GlobalConfigKey,
    onChange?: (viewModel: View | null) => void,
    disabled?: boolean,

    allowedTypes?: Array<ViewType>,
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
 *     const view = view.getViewByIdIfExists(viewId);
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
        table: PropTypes.instanceOf(Table),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,

        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(ViewTypes))),
        shouldAllowPickingNone: PropTypes.bool,
        placeholder: PropTypes.string,
        id: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
        'aria-labelledby': PropTypes.string,
        'aria-describedby': PropTypes.string,
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
        const {
            table,
            globalConfigKey,
            onChange,
            disabled,
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
                    <ViewPicker
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

export default withHooks<ViewPickerSyncedProps, {}, ViewPickerSynced>(ViewPickerSynced, props => {
    useWatchable(getSdk().base, ['tables']);
    useWatchable(props.table, ['views']);
    return {};
});
