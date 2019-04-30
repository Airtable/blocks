// @flow
const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');
const React = require('./react');
const PropTypes = require('prop-types');
const createDataContainer = require('./create_data_container');
const getSdk = require('../get_sdk');
const ViewPicker = require('./view_picker');
const TableModel = require('../models/table');
const ViewTypes = require('../types/view_types');
const invariant = require('invariant');
const globalConfigSyncedComponentHelpers = require('./global_config_synced_component_helpers');
const Synced = require('./synced');

import type ViewModel from '../models/view';
import type {ViewType} from '../types/view_types';
import type {GlobalConfigKey} from '../global_config';

type ViewPickerSyncedProps = {
    table?: TableModel,
    globalConfigKey: GlobalConfigKey,
    onChange?: (viewModel: ViewModel | null) => void,
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
        table: PropTypes.instanceOf(TableModel),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,

        // Passed through to ViewPicker:
        shouldAllowPickingNone: PropTypes.bool,
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(u.values(ViewTypes))),
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
    _getViewFromGlobalConfigValue(viewId: mixed): ViewModel | null {
        const {table} = this.props;
        if (!table || table.isDeleted) {
            return null;
        }
        return typeof viewId === 'string' && table ? table.getViewById(viewId) : null;
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

module.exports = createDataContainer(
    ViewPickerSynced,
    (props: ViewPickerSyncedProps) => {
        return [{watch: props.table, key: 'views'}, {watch: getSdk().base, key: 'tables'}];
    },
    ['focus', 'blur', 'click'],
);
