// @flow
const createDataContainer = require('block_sdk/frontend/ui/create_data_container');
const Synced = require('block_sdk/frontend/ui/synced');
const TablePicker = require('block_sdk/frontend/ui/table_picker');
const TablePickerSynced = require('block_sdk/frontend/ui/table_picker_synced');
const FieldPicker = require('block_sdk/frontend/ui/field_picker');
const FieldPickerSynced = require('block_sdk/frontend/ui/field_picker_synced');
const ViewPicker = require('block_sdk/frontend/ui/view_picker');
const ViewPickerSynced = require('block_sdk/frontend/ui/view_picker_synced');
const Input = require('block_sdk/frontend/ui/input');
const InputSynced = require('block_sdk/frontend/ui/input_synced');
const RadioSynced = require('block_sdk/frontend/ui/radio_synced');
const CellRenderer = require('block_sdk/frontend/ui/cell_renderer');
const expandRecord = require('block_sdk/frontend/ui/expand_record');
const expandRecordList = require('block_sdk/frontend/ui/expand_record_list');
const expandRecordPickerAsync = require('block_sdk/frontend/ui/expand_record_picker_async');
const GlobalAlert = require('block_sdk/frontend/ui/global_alert');
const FieldIcon = require('block_sdk/frontend/ui/field_icon');
const Icon = require('block_sdk/frontend/ui/icon');
const Loader = require('block_sdk/frontend/ui/loader');
const Tooltip = require('block_sdk/frontend/ui/tooltip');
const CollaboratorToken = require('block_sdk/frontend/ui/collaborator_token');
const ChoiceToken = require('block_sdk/frontend/ui/choice_token');
const colors = require('block_sdk/shared/colors');
const colorUtils = require('block_sdk/shared/color_utils');
const ColorPalette = require('block_sdk/frontend/ui/color_palette');
const ColorPaletteSynced = require('block_sdk/frontend/ui/color_palette_synced');
const ProgressBar = require('block_sdk/frontend/ui/progress_bar');
const Button = require('block_sdk/frontend/ui/button');
const RecordCard = require('block_sdk/frontend/ui/record_card');
const RecordCardList = require('block_sdk/frontend/ui/record_card_list');
const Select = require('block_sdk/frontend/ui/select');
const SelectSynced = require('block_sdk/frontend/ui/select_synced');
const SelectButtons = require('block_sdk/frontend/ui/select_buttons');
const SelectButtonsSynced = require('block_sdk/frontend/ui/select_buttons_synced');
const Modal = require('block_sdk/frontend/ui/modal');
const ConfirmationModal = require('block_sdk/frontend/ui/confirmation_modal');
const Toggle = require('block_sdk/frontend/ui/toggle');
const ToggleSynced = require('block_sdk/frontend/ui/toggle_synced');
const Popover = require('block_sdk/frontend/ui/popover');
const AutocompletePopover = require('block_sdk/frontend/ui/autocomplete_popover');
const ViewportConstraint = require('block_sdk/frontend/ui/viewport_constraint');
const Link = require('block_sdk/frontend/ui/link');
const {
    loadCSSFromString,
    loadCSSFromURLAsync,
    loadScriptFromURLAsync,
} = require('block_sdk/frontend/ui/remote_utils');

// TODO: freeze this object before we ship the code editor.
const UI = {
    Popover,
    AutocompletePopover,
    createDataContainer,
    loadCSSFromString,
    loadScriptFromURLAsync,
    loadCSSFromURLAsync,
    expandRecord,
    expandRecordList,
    expandRecordPickerAsync,
    Synced,
    TablePicker,
    TablePickerSynced,
    FieldPicker,
    FieldPickerSynced,
    ViewPicker,
    ViewPickerSynced,
    Input,
    InputSynced,
    RadioSynced,
    CellRenderer,
    FieldIcon,
    Icon,
    Loader,
    Tooltip,
    CollaboratorToken,
    ChoiceToken,
    colors,
    colorUtils,
    ColorPalette,
    ColorPaletteSynced,
    Link,
    ProgressBar,
    Button,
    RecordCard,
    RecordCardList,
    Select,
    SelectSynced,
    SelectButtons,
    SelectButtonsSynced,
    Modal,
    ConfirmationModal,
    Toggle,
    ToggleSynced,
    ViewportConstraint,
    globalAlert: new GlobalAlert(),
};

module.exports = UI;
