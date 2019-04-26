// @flow
const createDataContainer = require('./create_data_container');
const Synced = require('./synced');
const TablePicker = require('./table_picker');
const TablePickerSynced = require('./table_picker_synced');
const FieldPicker = require('./field_picker');
const FieldPickerSynced = require('./field_picker_synced');
const ViewPicker = require('./view_picker');
const ViewPickerSynced = require('./view_picker_synced');
const Input = require('./input');
const InputSynced = require('./input_synced');
const RadioSynced = require('./radio_synced');
const CellRenderer = require('./cell_renderer');
const expandRecord = require('./expand_record');
const expandRecordList = require('./expand_record_list');
const expandRecordPickerAsync = require('./expand_record_picker_async');
const GlobalAlert = require('./global_alert');
const FieldIcon = require('./field_icon');
const Icon = require('./icon');
const Loader = require('./loader');
const Tooltip = require('./tooltip');
const CollaboratorToken = require('./collaborator_token');
const ChoiceToken = require('./choice_token');
const colors = require('../../shared/colors');
const colorUtils = require('../../shared/color_utils');
const ColorPalette = require('./color_palette');
const ColorPaletteSynced = require('./color_palette_synced');
const ProgressBar = require('./progress_bar');
const Button = require('./button');
const RecordCard = require('./record_card');
const RecordCardList = require('./record_card_list');
const Select = require('./select');
const SelectSynced = require('./select_synced');
const SelectButtons = require('./select_buttons');
const SelectButtonsSynced = require('./select_buttons_synced');
const Modal = require('./modal');
const ConfirmationModal = require('./confirmation_modal');
const Toggle = require('./toggle');
const ToggleSynced = require('./toggle_synced');
const Popover = require('./popover');
const AutocompletePopover = require('./autocomplete_popover');
const ViewportConstraint = require('./viewport_constraint');
const Link = require('./link');
const {loadCSSFromString, loadCSSFromURLAsync, loadScriptFromURLAsync} = require('./remote_utils');

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
