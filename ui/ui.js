// @flow
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const TablePicker = require('client/blocks/sdk/ui/table_picker');
const TablePickerSynced = require('client/blocks/sdk/ui/table_picker_synced');
const FieldPicker = require('client/blocks/sdk/ui/field_picker');
const FieldPickerSynced = require('client/blocks/sdk/ui/field_picker_synced');
const ViewPicker = require('client/blocks/sdk/ui/view_picker');
const ViewPickerSynced = require('client/blocks/sdk/ui/view_picker_synced');
const Input = require('client/blocks/sdk/ui/input');
const InputSynced = require('client/blocks/sdk/ui/input_synced');
const RadioSynced = require('client/blocks/sdk/ui/radio_synced');
const CellRenderer = require('client/blocks/sdk/ui/cell_renderer');
const expandRecord = require('client/blocks/sdk/ui/expand_record');
const GlobalAlert = require('client/blocks/sdk/ui/global_alert');
const FieldIcon = require('client/blocks/sdk/ui/field_icon');
const Icon = require('client/blocks/sdk/ui/icon');
const Loader = require('client/blocks/sdk/ui/loader');
const Tooltip = require('client/blocks/sdk/ui/tooltip');
const CollaboratorToken = require('client/blocks/sdk/ui/collaborator_token');
const ChoiceToken = require('client/blocks/sdk/ui/choice_token');
const colors = require('client/blocks/sdk/ui/colors');
const colorUtils = require('client/blocks/sdk/ui/color_utils');
const ColorPalette = require('client/blocks/sdk/ui/color_palette');
const ColorPaletteSynced = require('client/blocks/sdk/ui/color_palette_synced');
const FieldTokenizedTextArea = require('client/blocks/sdk/ui/field_tokenized_text_area');
const FieldTokenizedTextAreaSynced = require('client/blocks/sdk/ui/field_tokenized_text_area_synced');
const ProgressBar = require('client/blocks/sdk/ui/progress_bar');
const Button = require('client/blocks/sdk/ui/button');
const RecordCard = require('client/blocks/sdk/ui/record_card');
const RecordCardList = require('client/blocks/sdk/ui/record_card_list');
const Select = require('client/blocks/sdk/ui/select');
const SelectSynced = require('client/blocks/sdk/ui/select_synced');
const SelectButtons = require('client/blocks/sdk/ui/select_buttons');
const SelectButtonsSynced = require('client/blocks/sdk/ui/select_buttons_synced');
const Modal = require('client/blocks/sdk/ui/modal');
const Toggle = require('client/blocks/sdk/ui/toggle');
const ToggleSynced = require('client/blocks/sdk/ui/toggle_synced');
const Popover = require('client/blocks/sdk/ui/popover');
const AutocompletePopover = require('client/blocks/sdk/ui/autocomplete_popover');
const {
    loadCSSFromString,
    loadCSSFromURLAsync,
    loadScriptFromURLAsync,
} = require('client/blocks/sdk/ui/remote_utils');

const UI = Object.freeze({
    Popover,
    AutocompletePopover,
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
    FieldTokenizedTextArea,
    FieldTokenizedTextAreaSynced,
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
    ProgressBar,
    Button,
    RecordCard,
    RecordCardList,
    Select,
    SelectSynced,
    SelectButtons,
    SelectButtonsSynced,
    Modal,
    Toggle,
    ToggleSynced,
    globalAlert: new GlobalAlert(),
});

module.exports = UI;
