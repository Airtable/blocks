"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors"));

var _color_utils = _interopRequireDefault(require("../color_utils"));

var _synced = _interopRequireDefault(require("./synced"));

var _table_picker = _interopRequireDefault(require("./table_picker"));

var _table_picker_synced = _interopRequireDefault(require("./table_picker_synced"));

var _field_picker = _interopRequireDefault(require("./field_picker"));

var _field_picker_synced = _interopRequireDefault(require("./field_picker_synced"));

var _view_picker = _interopRequireDefault(require("./view_picker"));

var _view_picker_synced = _interopRequireDefault(require("./view_picker_synced"));

var _input = _interopRequireDefault(require("./input"));

var _input_synced = _interopRequireDefault(require("./input_synced"));

var _cell_renderer = _interopRequireDefault(require("./cell_renderer"));

var _expand_record = _interopRequireDefault(require("./expand_record"));

var _expand_record_list = _interopRequireDefault(require("./expand_record_list"));

var _expand_record_picker_async = _interopRequireDefault(require("./expand_record_picker_async"));

var _global_alert = _interopRequireDefault(require("./global_alert"));

var _field_icon = _interopRequireDefault(require("./field_icon"));

var _icon = _interopRequireDefault(require("./icon"));

var _loader = _interopRequireDefault(require("./loader"));

var _tooltip = _interopRequireDefault(require("./tooltip"));

var _collaborator_token = _interopRequireDefault(require("./collaborator_token"));

var _choice_token = _interopRequireDefault(require("./choice_token"));

var _color_palette = _interopRequireDefault(require("./color_palette"));

var _color_palette_synced = _interopRequireDefault(require("./color_palette_synced"));

var _progress_bar = _interopRequireDefault(require("./progress_bar"));

var _button = _interopRequireDefault(require("./button"));

var _record_card = _interopRequireDefault(require("./record_card"));

var _record_card_list = _interopRequireDefault(require("./record_card_list"));

var _select = _interopRequireDefault(require("./select"));

var _select_synced = _interopRequireDefault(require("./select_synced"));

var _select_buttons = _interopRequireDefault(require("./select_buttons"));

var _select_buttons_synced = _interopRequireDefault(require("./select_buttons_synced"));

var _modal = _interopRequireDefault(require("./modal"));

var _dialog = _interopRequireDefault(require("./dialog"));

var _confirmation_dialog = _interopRequireDefault(require("./confirmation_dialog"));

var _toggle = _interopRequireDefault(require("./toggle"));

var _toggle_synced = _interopRequireDefault(require("./toggle_synced"));

var _popover = _interopRequireDefault(require("./popover"));

var _autocomplete_popover = _interopRequireDefault(require("./autocomplete_popover"));

var _viewport_constraint = _interopRequireDefault(require("./viewport_constraint"));

var _link = _interopRequireDefault(require("./link"));

var _remote_utils = require("./remote_utils");

var _initialize_block = _interopRequireDefault(require("./initialize_block"));

var _with_hooks = _interopRequireDefault(require("./with_hooks"));

var _use_loadable = _interopRequireDefault(require("./use_loadable"));

var _use_records = require("./use_records");

var _use_base = _interopRequireDefault(require("./use_base"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

var _use_viewport = _interopRequireDefault(require("./use_viewport"));

// TODO: freeze this object before we ship the code editor.
var UI = {
  Popover: _popover.default,
  AutocompletePopover: _autocomplete_popover.default,
  loadCSSFromString: _remote_utils.loadCSSFromString,
  loadScriptFromURLAsync: _remote_utils.loadScriptFromURLAsync,
  loadCSSFromURLAsync: _remote_utils.loadCSSFromURLAsync,
  expandRecord: _expand_record.default,
  expandRecordList: _expand_record_list.default,
  expandRecordPickerAsync: _expand_record_picker_async.default,
  Synced: _synced.default,
  TablePicker: _table_picker.default,
  TablePickerSynced: _table_picker_synced.default,
  FieldPicker: _field_picker.default,
  FieldPickerSynced: _field_picker_synced.default,
  ViewPicker: _view_picker.default,
  ViewPickerSynced: _view_picker_synced.default,
  Input: _input.default,
  InputSynced: _input_synced.default,
  CellRenderer: _cell_renderer.default,
  FieldIcon: _field_icon.default,
  Icon: _icon.default,
  Loader: _loader.default,
  Tooltip: _tooltip.default,
  CollaboratorToken: _collaborator_token.default,
  ChoiceToken: _choice_token.default,
  colors: _colors.default,
  colorUtils: _color_utils.default,
  ColorPalette: _color_palette.default,
  ColorPaletteSynced: _color_palette_synced.default,
  Link: _link.default,
  ProgressBar: _progress_bar.default,
  Button: _button.default,
  RecordCard: _record_card.default,
  RecordCardList: _record_card_list.default,
  Select: _select.default,
  SelectSynced: _select_synced.default,
  SelectButtons: _select_buttons.default,
  SelectButtonsSynced: _select_buttons_synced.default,
  Modal: _modal.default,
  Dialog: _dialog.default,
  ConfirmationDialog: _confirmation_dialog.default,
  Toggle: _toggle.default,
  ToggleSynced: _toggle_synced.default,
  ViewportConstraint: _viewport_constraint.default,
  globalAlert: new _global_alert.default(),
  initializeBlock: _initialize_block.default,
  withHooks: _with_hooks.default,
  useBase: _use_base.default,
  useViewport: _use_viewport.default,
  useWatchable: _use_watchable.default,
  useLoadable: _use_loadable.default,
  useRecordIds: _use_records.useRecordIds,
  useRecords: _use_records.useRecords,
  useRecordById: _use_records.useRecordById
};
var _default = UI;
exports.default = _default;