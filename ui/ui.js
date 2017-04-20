// @flow
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const TablePicker = require('client/blocks/sdk/ui/table_picker');
const TablePickerSynced = require('client/blocks/sdk/ui/table_picker_synced');
const FieldPicker = require('client/blocks/sdk/ui/field_picker');
const FieldPickerSynced = require('client/blocks/sdk/ui/field_picker_synced');
const ViewPicker = require('client/blocks/sdk/ui/view_picker');
const ViewPickerSynced = require('client/blocks/sdk/ui/view_picker_synced');
const InputSynced = require('client/blocks/sdk/ui/input_synced');
const RadioSynced = require('client/blocks/sdk/ui/radio_synced');
const CellRenderer = require('client/blocks/sdk/ui/cell_renderer');
const expandRecord = require('client/blocks/sdk/ui/expand_record');
const FieldIcon = require('client/blocks/sdk/ui/field_icon');
const Icon = require('client_server_shared/react/assets/icon');
const Loader = require('client/blocks/sdk/ui/loader');
const Tooltip = require('client/react/ui/tooltip/tooltip');
const {
    loadCSSFromString,
    loadCSSFromURLAsync,
    loadScriptFromURLAsync,
} = require('client/blocks/sdk/ui/remote_utils');

const UI = Object.freeze({
    createDataContainer,
    loadCSSFromString,
    loadScriptFromURLAsync,
    loadCSSFromURLAsync,
    expandRecord,
    TablePicker,
    TablePickerSynced,
    FieldPicker,
    FieldPickerSynced,
    ViewPicker,
    ViewPickerSynced,
    InputSynced,
    RadioSynced,
    CellRenderer,
    FieldIcon,
    Icon,
    Loader,
    Tooltip,
});

export type UIType = typeof UI;

module.exports = UI;
