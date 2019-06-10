// @flow
import PropTypes from 'prop-types';
import invariant from 'invariant';
import * as React from 'react';
import {values} from '../private_utils';
import getSdk from '../get_sdk';
import Table from '../models/table';
import {ViewTypes, type ViewType} from '../types/view';
import type View from '../models/view';
import {type GlobalConfigKey} from '../global_config';
import createDataContainer from './create_data_container';
import ViewPicker from './view_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

/** @typedef */
type ViewPickerSyncedProps = {
    table?: Table,
    globalConfigKey: GlobalConfigKey,
    onChange?: (viewModel: View | null) => void,
    disabled?: boolean,

    // Passed through to ViewPicker:
    shouldAllowPickingNone?: boolean,
    allowedTypes?: Array<ViewType>,
    placeholder?: string,
    style?: Object,
    className?: string,
};

/** */
class ViewPickerSynced extends React.Component<ViewPickerSyncedProps> {
    static propTypes = {
        table: PropTypes.instanceOf(Table),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,

        // Passed through to ViewPicker:
        shouldAllowPickingNone: PropTypes.bool,
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(ViewTypes))),
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
    };
    props: ViewPickerSyncedProps;
    _viewPicker: ViewPicker | null;
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
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <ViewPicker
                        ref={el => (this._viewPicker = el)}
                        disabled={this.props.disabled || !canSetValue}
                        view={this._getViewFromGlobalConfigValue(value)}
                        onChange={view => {
                            setValue(view ? view.id : null);
                            if (this.props.onChange) {
                                this.props.onChange(view);
                            }
                        }}
                        {...restOfProps}
                    />
                )}
            />
        );
    }
}

export default createDataContainer(
    ViewPickerSynced,
    (props: ViewPickerSyncedProps) => {
        return [{watch: props.table, key: 'views'}, {watch: getSdk().base, key: 'tables'}];
    },
    ['focus', 'blur', 'click'],
);
