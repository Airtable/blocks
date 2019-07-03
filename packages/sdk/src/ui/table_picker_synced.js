// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import type Table from '../models/table';
import {type GlobalConfigKey} from '../global_config';
import TablePicker from './table_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

/**
 * @typedef {object} TablePickerSyncedProps
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The selected table will always reflect the table id stored in `globalConfig` for this key. Selecting a new table will update `globalConfig`.
 * @property {function} [onChange] A function to be called when the selected table changes. This should only be used for side effects.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the picker.
 * @property {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected table.
 * @property {string} [placeholder='Pick a table...'] The placeholder text when no table is selected.
 * @property {string} [id] The ID of the picker element.
 * @property {string} [className] Additional class names to apply to the picker.
 * @property {object} [style] Additional styles to apply to the picker.
 * @property {number | string} [tabIndex] Indicates if the picker can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type TablePickerSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    onChange?: (tableModel: Table | null) => void,
    disabled?: boolean,

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
        onChange: PropTypes.func,
        disabled: PropTypes.bool,

        shouldAllowPickingNone: PropTypes.bool,
        placeholder: PropTypes.string,
        id: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
        'aria-labelledby': PropTypes.string,
        'aria-describedby': PropTypes.string,
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
        const {
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
                    <TablePicker
                        ref={el => (this._tablePicker = el)}
                        table={this._getTableFromGlobalConfigValue(value)}
                        onChange={table => {
                            setValue(table ? table.id : null);
                            if (onChange) {
                                onChange(table);
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

export default withHooks<TablePickerSyncedProps, {}, TablePickerSynced>(TablePickerSynced, () => {
    useWatchable(getSdk().base, ['tables']);
    return {};
});
